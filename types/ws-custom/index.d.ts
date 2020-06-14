import * as http from 'http';
import {sessToken} from '../../model';

declare module "http" {
    interface IncomingMessage {
        user?: sessToken;
    }    
}
