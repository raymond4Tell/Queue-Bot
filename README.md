# Queue-Bot

A system for ensuring "prompt" service, to be used in places of non-urgent/-triaged service. DMV, post office, walk-in clinic, repair shops, any place where customers can wait indefinitely before being served.

Two primary innovations:
* Jobs/customers are sorted into an ordering which minimizes the total value of customer time in the queue. Curently, that's a Priority Queue that sorts by customerTimeValue / taskDuration, sorting busy customers and small tasks ahead of patient customers with large tasks. IE, given customer A ($20/hr, wants 1 minute to buy stamps) and customer B($18/hr, wants 45m to send large package overseas), serving B before A will cost $15 in time spent waiting (.75hr of A's time * $20/hr of A's time-value), while A before B will cost only $0.30 (1/60hr * $18/hr), a substantial savings and the preferred ordering.

On the other hand, this is vulnerable to customers lying about their time-value, reducing the system to bidding wars between fantasy billionaires, and it also solidifies existing privileges and advantages for the rich. To solve this, and keep people honest, we add the second innovation.

* Customers make/receive payments according to how long they wait relative to an "average" Break-Even Wait Time, abbreviated BEWT in the code. Given the A-B example above, BEWT is about 25 seconds, and since A's wait of 0m is less time than that, she pays $.14, while B, who waits longer than BEWT, is paid $.14 for her patience. (The actual formulas for payment and BEWT are not complicated, but beyond the scope of this README.) Ideally, these payments balance out, so payments from busy people match payments to patient people, but it's trivial to modify this to make the system self-funding. To some extent, this is replacing the current system, where Richie Rich bribes a maitre'd to get served first, with a substantially more equitable one where Richie Rich has to bribe everybody else in line to get served first. It additionally provides some incentive to be honest about how little one's time is worth, since poor/non-busy people get paid for their time.


## Credit and Inspiration
This system is based on David Jones's Daedalus columns, specifically [the Op-time-miser system described in the 16 Feb 1989 issue of Nature](http://www.nature.com/nature/journal/v337/n6208/pdf/337604a0.pdf)

[![forthebadge](http://forthebadge.com/images/badges/approved-by-george-costanza.svg)](http://forthebadge.com)
