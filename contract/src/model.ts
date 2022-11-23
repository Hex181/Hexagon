import { UnorderedMap } from "near-sdk-js";

export class Manufacturer {
    id: string;
    name: string;
    products: string[];

    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
        this.products = [];
    }
}

export class Product {
    name: string;
    url: string;
    manufacturer: string;
    items: string[];

    constructor(name: string, url: string, manufacturer: string) {
        this.name = name;
        this.url = url;
        this.manufacturer = manufacturer;
        this.items = [];
    }
}

export class Item {
    hash: string;
    product: string;
    bought: boolean;

    constructor(hash: string, product: string) {
        this.hash = hash;
        this.product = product;
        this.bought = false;
    }
}