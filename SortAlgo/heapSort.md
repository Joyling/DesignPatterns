```javascript

function heapSort(arr) {
  var size = arr.length;
  if(size <= 1) return arr
  var index = Math.floor(size / 2) - 1;
  for(var i = index; i >= 0; i--) {
    maxHeapify(arr, i, size)
  }
  for(var j = 0; j < size; j++) {
    swap(arr, 0, size - j - 1);
    maxHeapify(arr, 0, size - j - 2)
  }
  return arr;
}

function maxHeapify(arr, i, size) {
  var left = 2 * i + 1; 
  var right = 2 * i + 2;
  var lagest = i;
  if(left <= size && arr[lagest] < arr[left]) {
    lagest = left;
  }
  if(right <= size && arr[lagest] < arr[right]) {
    lagest = right;
  }
  if(lagest !== i) {
    swap(arr, i, lagest);
    maxHeapify(arr, lagest, size)
  }
}

function swap(arr, a, b) {
  if(a === b) return
  var temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

heapSort([5, 2, 4, 6, 1,1,1,1,1,1, 3,7,8,9,23]); 
heapSort([5]); 
heapSort([]); 

```

堆是一个完全二叉树，并且堆上的任意节点值都必须大于等于（大顶堆）或小于等于（小顶堆）其左右子节点值，推可以采用数组存储法存储，可以通过插入式建堆或原地建堆，堆的重要应用有：

推排序
Top K 问题：堆化，取前 K 个元素
中位数问题：维护两个堆，一大（前50%）一小（后50%），奇数元素取大顶堆的堆顶，偶数取取大、小顶堆的堆顶

```javascript

// Top k问题
function finnKthLargest(nums,k) {
  // 从nums中取出前k个数，构建一个小顶堆
  let heap = [,], i = 0;
  while(i < k) {
    heap.push(nums[i++])
  }
  buildHeap(heap, k);

  // 从k位开始遍历数组 
  for(let i = k; i < nums.length; i++) {
    if(heap[1] < nums[i]) {
      // 替换并堆化
      heap[1] = nums[i];
      heapify(heap, k, 1);
    }
  }
  return heap[1];
}
// 原地建堆，从后往前，自上而下式建小顶堆
function buildHeap(arr, k) {
  if(k === 1) return
  // 从最后一个非叶子节点开始，自上而下式堆化
  for(var i = Math.floor(k / 2); i >= 1; i--) {
    heapify(arr, k, i);
  }
}

// 堆化
function heapify(arr, k, i) {
  while(true) {
    var midIndex = i;
    let left = 2 * i, right = 2 * i + 1;
    if(left <= k && arr[left] < arr[midIndex]) {
      midIndex = left;
    }
    if(right <= k && arr[right] < arr[midIndex]) {
      midIndex = right;
    }
    if(midIndex !== i) {
      swap(arr, i, midIndex);
      i = midIndex;
    }else {
      break;
    }
  }
}

function swap(arr,i,j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

console.log(finnKthLargest([1,2,3,4,5,2,6,7,8,8,3,3,2], 3))
```


```javascript
// 中位数

let MedianFinder = function() {
    // 大顶堆，用来保存前 n/2 小的元素
    this.lowHeap = new MaxHeap()
    // 小顶堆，用来保存后 n/2 小的元素
    this.hightHeap = new MinHeap()
};
// 插入元素
MedianFinder.prototype.addNum = function(num) {
    // 如果大顶堆为空或大顶堆堆顶元素小于num，则插入大顶堆
    // 否则插入到小顶堆中
    if(!this.lowHeap.getSize() || num < this.lowHeap.getHead()) {
        // 比大顶堆的堆顶小，插入到大顶堆中
        this.lowHeap.insert(num)
    } else {
        // 比小顶堆的堆顶大，插入到小顶堆中
        this.hightHeap.insert(num)
    }

    // 比较大小顶堆的是否依然保持平衡
    if(this.lowHeap.getSize() - this.hightHeap.getSize() > 1) {
        // 大顶堆往小顶堆迁移
        this.hightHeap.insert(this.lowHeap.removeHead())
    }
    if(this.hightHeap.getSize() > this.lowHeap.getSize()) {
        // 小顶堆向大顶堆迁移
        this.lowHeap.insert(this.hightHeap.removeHead())
    }
};
// 获取中位数
MedianFinder.prototype.findMedian = function() {
    if(this.lowHeap.getSize() && this.lowHeap.getSize() === this.hightHeap.getSize()) {
        return (this.lowHeap.getHead() + this.hightHeap.getHead())/2
    }
    return this.lowHeap.getHead()
};

// 小顶堆
let MinHeap = function() {
    let heap = [,]
    // 堆中元素数量
    this.getSize = ()=> heap.length - 1
    // 插入
    this.insert = (key) => {
        heap.push(key)
        // 获取存储位置
        let i = heap.length-1
        while (Math.floor(i/2) > 0 && heap[i] < heap[Math.floor(i/2)]) {  
            swap(heap, i, Math.floor(i/2)); // 交换 
            i = Math.floor(i/2); 
        }
    }
    // 删除堆头并返回
    this.removeHead = () => {
        if(heap.length > 1) {
            if(heap.length === 2) return heap.pop()
            let num = heap[1]
            heap[1] = heap.pop()
            heapify(1)
            return num
        }
        return null
    }
    // 获取堆头
    this.getHead = () => {
        return heap.length > 1 ? heap[1]:null
    }
    // 堆化
    let heapify = (i) => {
        let k = heap.length-1
        // 自上而下式堆化
        while(true) {
            let minIndex = i
            if(2*i <= k && heap[2*i] < heap[i]) {
                minIndex = 2*i
            }
            if(2*i+1 <= k && heap[2*i+1] < heap[minIndex]) {
                minIndex = 2*i+1
            }
            if(minIndex !== i) {
                swap(heap, i, minIndex)
                i = minIndex
            } else {
                break
            }
        }
    } 
    let swap = (arr, i, j) => {
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

// 大顶堆
let MaxHeap = function() {
    let heap = [,]
    // 堆中元素数量
    this.getSize = ()=>heap.length - 1
    // 插入大顶堆
    this.insert = (key) => {
        heap.push(key)
        // 获取存储位置
        let i = heap.length-1
        while (Math.floor(i/2) > 0 && heap[i] > heap[Math.floor(i/2)]) {  
            swap(heap, i, Math.floor(i/2)); // 交换 
            i = Math.floor(i/2); 
        }
    }
    // 获取堆头
    this.getHead = () => {
        return heap.length > 1 ? heap[1]:null
    }
    // 删除堆头并返回
    this.removeHead = () => {
        if(heap.length > 1) {
            if(heap.length === 2) return heap.pop()
            let num = heap[1]
            heap[1] = heap.pop()
            heapify(1)
            return num
        }
        return null
    }
    // 堆化
    let heapify = (i) => {
        let k = heap.length-1
        // 自上而下式堆化
        while(true) {
            let maxIndex = i
            if(2*i <= k && heap[2*i] > heap[i]) {
                maxIndex = 2*i
            }
            if(2*i+1 <= k && heap[2*i+1] > heap[maxIndex]) {
                maxIndex = 2*i+1
            }
            if(maxIndex !== i) {
                swap(heap, i, maxIndex)
                i = maxIndex
            } else {
                break
            }
        }
    } 
    let swap = (arr, i, j) => {
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

```