arr = [7, 8, 9, 10, 3, 5, 6]
target = 6

class findIdxOne():
    def __init__(self, arr, target): 
        # Work as a constructor
        self.arr = arr
        self.target = target
        print(self.findIdxTwo(arr, target))

    # Below is the method function of python class. If I was using C++, 
    # I would put these in private section
    def findIdxTwo(self, arr, target):
        cutPoint = self.findCutPoint(arr)
        if arr[len(arr)-1] == target:
            return len(arr)-1
        elif arr[len(arr)-1] > target:
            return cutPoint + self.binarySearch(arr[cutPoint:], target)
        else:
            return self.binarySearch(arr[:cutPoint], target)

    def findCutPoint(self, arr):
        lastIdx = len(arr)-1
        middleIdx = len(arr)//2

        if len(arr) == 2:
            return 1

        if arr[middleIdx] > arr[lastIdx]:
            return middleIdx + self.findCutPoint(arr[middleIdx:])
        else:
            return self.findCutPoint(arr[:middleIdx+1])
    
    def binarySearch(self, arr, target):
        if len(arr) == 0:
            return -1
        
        middleIdx = len(arr) // 2
        if arr[middleIdx] == target:
            return middleIdx
        elif arr[middleIdx] < target:
            return middleIdx + 1 + self.binarySearch(arr[middleIdx+1:], target)
        else:
            return self.binarySearch(arr[:middleIdx], target)



class findIdxTwo():
    def __init__(self, arr, target): # Constructor
        self.arr = arr
        self.target = target
        print(self.findIdx(arr, target))

    # Method function. Probably put into private section in C++
    def findIdx(self, arr, target):
        middleIdx = len(arr)//2
        firstIdx = 0

        if len(arr) == 0:
            return -1
        if arr[middleIdx] == target:
            return middleIdx
        if arr[firstIdx] == target:
            return firstIdx

        if arr[middleIdx] < arr[firstIdx]:
            if target < arr[middleIdx] or target > arr[firstIdx]:
                return 1 + self.findIdx(arr[firstIdx+1:middleIdx], target)
            else:
                return middleIdx + 1 + self.findIdx(arr[middleIdx+1:], target)
        
        else:
            if target < arr[firstIdx] or target > arr[middleIdx]:
                return middleIdx + 1 + self.findIdx(arr[middleIdx+1:], target)
            else:
                return 1 + self.findIdx(arr[firstIdx+1:middleIdx], target)

findIdxOne(arr, target)
findIdxTwo(arr, target)