Queue-Bot
=========

A system for ensuring prompt service.

Two primary innovations:
* Jobs/customers are stored in a Priority Queue that sorts by customerTimeValue / taskDuration, so busy customers or ones with quick and simple tasks get served before more patient customers with more involved requests. This is done to minimize the total value of time lost in lines and waiting rooms. Bill Gates is a busy man, and we should not ask him to wait behind somebody who wants to know *all* their options for sending Grandmama's china to Outer Mongolia by combination slow boat and air freight.

On the other hand, this is vulnerable to customers lying about their time-value, and reducing the system to auctions between clones of Bill Gates. To solve this, we add the second innovation.

* Customers pay/are paid according to how long they wait relative to an "average" Break-Even Wait Time, abbreviated BEWT in the code. If the system calculates a BEWT of 50 minutes, then a customer who gets served after a 40 minute wait (10 minutes under BEWT) and values their time at $30/hr will pay $5 for their time savings, while somebody whose time is worth $15/hr and waits 5 minutes over BEWT will be paid $1.25 for their patience.
  
  Each customer's payment is customerTimeValue * (timeSpentWaiting - BEWT), with positive payments being to the customer and negative being from the customer.  
  BEWT is calculated such that sum(each customer's payment) == balanceOnMachine  
  balanceOnMachine is initially and usually 0, but will change as customers leave the queue, making and receiving payments.

## Current Priorities
1. ~~Need to allow for persons arriving at different times.~~
  * Everybody just has timeEnqueued and timeSpentWaiting values, and calculations are made based on those.
2. Need to add/test flags for priority tasks or C-level/VIP customers.
  * Can likely be handled by the simple fact that a VIP has a higher time-rate than other customers?
  * Still need solution for handling priority drop-everything-and-put-out-these-fires tasks.
3. Need to add a graphical/web interface, probably in Angular.
  * In progress.
4. Need to add some better testing mocks.
5. Need to improve sorting algorithm to better model the value of people's time, and how it increases over time spent in the waiting room. IE, somebody who valued their time at $15/hr when enqueued 2hr previously may value it at $20/hr after so long spent waiting.
  * Can probably add a config value and check in the comparator, like `if (timeSpentWaiting > unreasonableWait) timeValue *= 2`
6. Need also to improve scheduling to handle multiple servers. I know I saw an algorithm for this, but do not recall it at this time. Will find it later.
  * Possible problem: This might require substantial refactoring, as simple PQueue is no longer sufficient to represent sorted ordering.
7. Need capability for customers to change their timeValues after creating job, to adjust how much they're really willing to pay for service. This may conflict with or solve point 5 above.

## Credit and Inspiration
This system is based on David Jones's Daedalus columns, specifically [the Op-time-miser system described in the 16 Feb 1989 issue of Nature](http://www.nature.com/nature/journal/v337/n6208/pdf/337604a0.pdf)
