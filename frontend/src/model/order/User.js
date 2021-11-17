/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import Address from "./Address";
import Cloneable from "../../Cloneable";


export default class User extends Cloneable{

    constructor(){
        super();
        this.firstName = "";

        this.lastName = "";

        this.phone = "";

        this.email = "";

        /** @type {Address} */
        this.address = new Address();

        this.businessName = "";
    }


    /**
     * @return {User}
     */
    copy(){
        let user = new User();
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.phone = this.phone;
        user.email = this.email;
        user.address = this.address.copy();
        user.businessName = this.businessName;
        return user;
    }
}