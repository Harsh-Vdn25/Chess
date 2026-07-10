export class Queue<T>{
    private items:T[] = [];

    enqueue(value:T):void{
        this.items.push(value);
    }

    dequeue():T | undefined {
        return this.items.shift();
    }
    isEmpty():boolean{
        return this.items.length === 0;
    }
    size():number{
        return this.items.length;
    }
    contains(value:T):boolean{
        const id = this.items.find(x=>x===value);
        return id!==undefined;
    }
}