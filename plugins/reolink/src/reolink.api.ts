import { sleep } from "@scrypted/common/src/sleep";
import AxiosDigestAuth from "@koush/axios-digest-auth/dist";
import crypto from 'crypto';

export class ReolinkCameraClient {
    digestAuth: AxiosDigestAuth;

    constructor(public host: string, public username: string, public password: string, public channelId: number, public console: Console) {
        this.digestAuth = new AxiosDigestAuth({
            password,
            username,
        });
    }

    // [
    //     {
    //        "cmd" : "GetMdState",
    //        "code" : 0,
    //        "value" : {
    //           "state" : 0
    //        }
    //     }
    //  ]
    async getMotionState() {
        const url = new URL(`http://${this.host}/api.cgi`);
        const params = url.searchParams;
        params.set('cmd', 'GetMdState');
        params.set('channel', this.channelId.toString());
        params.set('user', this.username);
        params.set('password', this.password);
        const response = await this.digestAuth.request({
            url: url.toString(),
        });
        return {
            value: !!response.data[0].value.state,
            data: response.data,
        };
    }

    async jpegSnapshot() {
        const url = new URL(`http://${this.host}/api.cgi`);
        const params = url.searchParams;
        params.set('cmd', 'Snap');
        params.set('channel', this.channelId.toString());
        params.set('rs', Date.now().toString());
        params.set('user', this.username);
        params.set('password', this.password);

        const response = await this.digestAuth.request({
            url: url.toString(),
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data);
    }
}
