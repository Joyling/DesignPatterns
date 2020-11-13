
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


/*
堆是一个完全二叉树，并且堆上的任意节点值都必须大于等于（大顶堆）或小于等于（小顶堆）其左右子节点值，推可以采用数组存储法存储，可以通过插入式建堆或原地建堆，堆的重要应用有：

推排序
Top K 问题：堆化，取前 K 个元素
中位数问题：维护两个堆，一大（前50%）一小（后50%），奇数元素取大顶堆的堆顶，偶数取取大、小顶堆的堆顶

*/