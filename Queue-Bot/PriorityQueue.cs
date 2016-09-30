using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;

namespace Queue_Bot
{ /// <summary> Generic priority queue interface. </summary>
  /// <remarks> David Venegoni, Jan 02 2014. </remarks>
  /// <typeparam name="T"> Generic type parameter.  Must implement the IComparable interface. </typeparam>
    public interface IPriorityQueue<T> : IEnumerable<T> where T : IComparable<T>
    {
        /// <summary> Gets the number of items in the priority queue. </summary>
        /// <value> The number of items in the priority queue. </value>
        Int32 Count { get; }

        /// <summary> Adds an item to the priority queue, inserting it with respect to its priority. </summary>
        /// <param name="item"> The item to add. </param>
        void Add(T item);

        /// <summary> Adds a range of items to the priority queue, inserting them with respect to their priority. </summary>
        /// <param name="itemsToAdd"> An IEnumerable&lt;T&gt; of items to add to the priority queue. </param>
        void AddRange(IEnumerable<T> itemsToAdd);

        /// <summary> Clears all the items from the priority queue. </summary>
        void Clear();

        /// <summary> Clears all the items starting at the specified start index. </summary>
        /// <param name="startIndex"> The start index. </param>
        /// <returns> The number of items that were removed from the priority queue. </returns>
        Int32 Clear(Int32 startIndex);

        /// <summary> Clears the number of items specified by count from the priority queue starting at specified start index. </summary>
        /// <param name="startIndex"> The start index. </param>
        /// <param name="count">      Number of items to remove. </param>
        void Clear(Int32 startIndex, Int32 count);

        /// <summary> Clears all the items that satisfy the specified predicate function. </summary>
        /// <param name="predicateFunction"> The predicate function to use in determining which items should be removed. </param>
        /// <returns> The number of items that were removed from the priority queue. </returns>
        Int32 ClearWhere(Func<T, Boolean> predicateFunction);

        /// <summary> Pops an item from the front of the queue. </summary>
        /// <returns> An item from the front of the queue. </returns>
        T PopFront();

        /// <summary> Pops an item from the back of the queue. </summary>
        /// <returns> An item from the back of the queue. </returns>
        T PopBack();

        /// <summary> Peeks at the item at the front of the queue, but does not remove it from the queue. </summary>
        /// <returns> The item that is at the front of the queue. </returns>
        T PeekFront();

        /// <summary> Peek at the item at the back of the queue, but does not remove it from the queue. </summary>
        /// <returns> The item that is at the back of the queue. </returns>
        T PeekBack();

        /// <summary> Pops the specified number of items from the front of the queue. </summary>
        /// <param name="numberToPop"> Number of items to pop from the front of the queue. </param>
        /// <returns> The items that were popped from the front of the queue. </returns>
        IEnumerable<T> PopFront(Int32 numberToPop);

        /// <summary> Pops the specified number of items from the back of the queue. </summary>
        /// <param name="numberToPop"> Number of items to pop from the back of the queue. </param>
        /// <returns> The items that were popped from the back of the queue. </returns>
        IEnumerable<T> PopBack(Int32 numberToPop);

        /// <summary> Queries if the priority queue is empty. </summary>
        /// <returns> true if the priority queue is empty, false if not. </returns>
        Boolean IsEmpty();
    }

    [Serializable]
    public class PriorityQueue<T> : IEnumerable<T>, IPriorityQueue<T>
        where T : IComparable<T>
    {
        private SortedSet<T> internalSet;
        public PriorityQueue() { internalSet = new SortedSet<T>(); }
        public IEnumerator<T> GetEnumerator()
        {
            return internalSet.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public int Count
        {
            get { return internalSet.Count; }
        }
        public void Add(T item)
        {
            internalSet.Add(item);
        }

        public void AddRange(IEnumerable<T> itemsToAdd)
        {
            foreach (var item in itemsToAdd)
            {
                Add(item);
            }
        }

        public void Clear()
        {
            internalSet = new SortedSet<T>();
        }

        public int Clear(int startIndex)
        {
            throw new NotImplementedException();
        }

        public void Clear(int startIndex, int count)
        {
            throw new NotImplementedException();
        }

        public int ClearWhere(Func<T, bool> predicateFunction)
        {
            return internalSet.RemoveWhere(predicateFunction.Invoke);
        }

        public T PopFront()
        {
            var foo = internalSet.Min;
            internalSet.Remove(foo);
            return foo;
        }

        public T PopBack()
        {
            throw new NotImplementedException();
        }

        public T PeekFront()
        {
            return internalSet.Max;
        }

        public T PeekBack()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<T> PopFront(int numberToPop)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<T> PopBack(int numberToPop)
        {
            throw new NotImplementedException();
        }

        public bool IsEmpty()
        {
            return Count == 0;
        }
    }
}
