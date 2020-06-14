import {sessToken} from '../../model';

// problem in express, use global override

declare global {
    namespace Express {
        export interface Request {
            user?: sessToken;
        }
    }
}
