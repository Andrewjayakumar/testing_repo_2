import { RequestMethod } from '@angular/http';

export class DataServiceOptions {
    public method: RequestMethod;
    public url: string;
    public headers: any = {};
    public params: any = {};
    public data: any = {};
}
