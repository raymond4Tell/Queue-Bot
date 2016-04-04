# Queue-Bot

A system for ensuring "prompt" service, to be used in places of non-urgent/-triaged service. DMV, post office, walk-in clinic, repair shops, any place where customers can wait indefinitely before being served.

Two primary innovations:
* Jobs/customers are sorted into an ordering which minimizes the total value of customer time in the queue. Curently, that's a Priority Queue that sorts by customerTimeValue / taskDuration, sorting busy customers and small tasks ahead of patient customers with large tasks. IE, given customer A ($20/hr, wants 1 minute to buy stamps) and customer B($18/hr, wants 45m to send large package overseas), serving B before A will cost $15 in time spent waiting (.75hr of A's time * $20/hr of A's time-value), while A before B will cost only $0.30 (1/60hr * $18/hr), a substantial savings and the preferred ordering.

On the other hand, this is vulnerable to customers lying about their time-value, reducing the system to bidding wars between fantasy billionaires, and solidifies existing privileges and advantages for the rich. To solve this, and keep people honest, we add the second innovation.

* Customers make/receive payments according to how long they wait relative to an "average" Break-Even Wait Time, abbreviated BEWT in the code. Given the A-B example above, BEWT is about 25 seconds, and since A's wait of 0m is less time than that, she pays $.14, while B, who waits longer than BEWT, is paid $.14 for her patience. (The actual formulas for payment and BEWT are not complicated, but beyond the scope of this README.) Ideally, these payments balance out, so payments from busy people match payments to patient people, but it's trivial to modify this to make the system self-funding. To some extent, this is replacing the current system, where Richie Rich bribes a maitre'd to get served first, with a substantially more equitable one where Richie Rich has to bribe everybody else in line to get served first.


## Credit and Inspiration
This system is based on David Jones's Daedalus columns, specifically [the Op-time-miser system described in the 16 Feb 1989 issue of Nature](http://www.nature.com/nature/journal/v337/n6208/pdf/337604a0.pdf)


## MoSCoW Priorities   
### MUST-Have Capabilities and Use-cases
1. ~~Basic scheduling system, capable of handling multiple users with multiple tasks and enqueue-times, and calculating necessary properties for queue and customers.~~
2. Register new users ~~and service requests~~.
2. Register users as customers or admins.
3. ~~Remove customers, pop requests off the queue.~~
1. Take payment as part of popping requests
    * Partly complete; still need to hook actual money APIs, but everything else is under control.
1. Graphical UI, preferably Angular/ASP.NET MVC
    * Working on it.

### Should-Have
1. Database support for persisting and listing services and customers.
1. Adjust user/service request; changing time-value, PII, requested task, as needed.
1. Automatically and proactively forward to admins/servers customers ready for service, rather than requiring admins to manually request new customer.
1. Authentication tying to Facebook/Google/Whatever.

### Could-Have
1. Scheduling and handling requests in parallel.
1. Flags and custom programming for non-standard cases; VIP, non-urgent triage, surcharge/discount for customer behavior, time-values increasing over time, that sort of nonsense.

### Would Like
1. *Pretty* UI.

## Major Issues
Good solutions for these will probably require connecting with an actual business-type person who better understands the problem at hand. In the meantime, I'm just demonstrating that I am aware of them and the need to work out something better than "Execute uncooperative customers".
* Scheduling is dependent on accurately estimating how long each customer's service will take. Will cause issues if somebody's simple checkup balloons into a major examination.
  * Best solution probably to a) err on the side of caution and set service time at average + 1 standard deviation and b) consider job complete when customer leaves your hands. Doesn't matter if they're discharged to waiting room or transferred to MRI room, NEXT PATIENT!
* Similar to above, is dependent on customers accurately stating what service they require. Will also cause issues if a customer who was in line for a pack of stamps decides they also want a list of options for shipping a TV.
  * Favorite solution is public execution for customers who lie about what service they need, *pour encourager les autres*. Best solution would be to leave it to business's discretion whether customer gets served or sent back in line.
* Still don't have good method for handling open-ended tasks.
  * Apart from the answers to the previous problems, can probably just call it a Consultation task. Unusually large duration, to be used for half-defined tasks like discussing all the possible explanations for this lump on my arm, or working out the best way to ship 300lbs of marzipan to Ann Arbor.
* This adds complication; instead of merely taking a seat, or taking a number, queuers need to register as a client, enter how much they value their time, select which service they require, and then take a number and seat. That's a troublesome hurdle. Possibly even worse when they have to break out the wallet to pay/get paid for their queue time, though that might also just get combined with the existing cost of service, minimizing any impact to the customer.

## Program Structure
_*Three Model Classes*_
* Task
 * Customer - Who wants it
 * Job - What they want. Read-only.
 * Enqueued - When they joined the queue. Read-only.
 * ExpectedService - When they can expect to leave the queue. Subject to change.
 * WaitTime - Time spent waiting. Property; calculated as ExpectedService - Enqueued
 * Balance - What the customer will pay/be paid for their time. Property; Customer.TimeValue * (WaitTime - BEWT)

* Customer
 * Name/Email/Phone/PIN - Human-readable description and identification data.
 * TimeValue - How much they value their time, how much money it costs them to wait in line, how much they're willing to pay to get served earlier.
 * Whatever other nonsense we need for authentication.

* Service
 * Name/Description - Human-readable description and identification data.
 * Duration - Reasonable expectation of service duration, preferably on the high end. People complain less if they're done early than if they have to wait.

*_Program State_*
* JobQueue - Actual queue and ordering for tasks. Currently PQueue/SortedList, but might need to change.
* Balance - How much money the machine has on hand; initialized to 0, but changes as customers make and take payments. 
* BEWT - Break-Even Wait Time. Calculated so the sum of each customer's payments is equal to the current balance on the machine. The actual derivation is tedious, but comes to BEWT = sum(Task.Customer.TimeValue * Task.WaitTime)/sum(Task.Customer.TimeValue)
* Probably a few other fields for internal use; timeNextServerAvailable might be useful for sorting out the queues, f'rinstance.

