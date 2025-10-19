export enum ReqStatus {
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    PENDING = "PENDING",
}

export default class RequestEntity {
    id: string;
    email: string;
    tel: string;
    description: string;
    status: ReqStatus;

    constructor(id: string, email: string, tel: string, description: string, status: ReqStatus) {
        this.id = id;
        this.email = email;
        this.tel = tel;
        this.description = description;
        this.status = status;
    }
}

export interface IRequest {
    id: string;
    email: string;
    tel: string;
    description: string;
    status: ReqStatus;
}