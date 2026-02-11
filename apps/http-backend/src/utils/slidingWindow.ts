export class SlidingWindow {
  private windowSize: number;
  private windowStart: number;
  private requests: number[];
  private requestLimit: number;
  private reqTime: number;
  constructor(windowSize: number, requestLimit: number) {
    this.windowSize = windowSize;
    this.requestLimit = requestLimit;
    this.windowStart = Date.now();
    this.requests = [];
    this.reqTime = 0;
  }
  allowRequest() {
    const now = Date.now();
    this.reqTime = now - this.windowStart;

    while (
      this.requests.length > 0 &&
      this.requests[0]! < this.reqTime - this.windowSize * 1000
    ) {
        this.requests.shift();
    }

    if(this.requests.length > this.requestLimit){
        return false;
    }else{
        this.requests.push(this.reqTime);
    }
    return true;
  }
}
