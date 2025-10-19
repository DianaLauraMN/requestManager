import RequestEntity, { IRequest, ReqStatus } from "../entities/RequestEntity";

let requests: IRequest[] = [{
    id: "1",
    email: "sadasd@gmail.com",
    tel: "6442324543",
    description: "I am getting married and this is the best salon for it",
    status: ReqStatus.PENDING,
}, {
    id: "2",
    email: "abc@gmail.com",
    tel: "6444205524",
    description: "My daugther is turning 15 the next year so i would like to celebrate her birthday in this salon",
    status: ReqStatus.PENDING,
},
{
    id: "3",
    email: "sassuke@gmail.com",
    tel: "6444039488",
    description: "I like this salon for my bestfriend naruto's wedding",
    status: ReqStatus.PENDING,
}];

function clearArray() {
    requests = [];
}

function updateArray(newArr: RequestEntity[]) {
    requests = newArr;
}
export { requests, clearArray, updateArray }

