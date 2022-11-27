// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap, bytes } from 'near-sdk-js';
import { keccak256 } from 'near-sdk-js/lib/api';
import { Manufacturer, Product, Item } from "./model";

@NearBindgen({})
class BonaFide {
  manufacturers: UnorderedMap<Manufacturer> = new UnorderedMap<Manufacturer>('unique-id-map1');
  products: UnorderedMap<Product> = new UnorderedMap<Product>('unique-id-map2');
  items: UnorderedMap<Item> = new UnorderedMap<Item>('unique-id-map3');

  @call({})
  register_manufacturer({ name }: { name: string }): void {
    assert(name, "Name must be provided!");
    // Confirm account is not already registered
    const account_id = near.predecessorAccountId();
    assert(!this.is_manufacturer({ account_id }), "Account already registerd!");
    // Register account
    this.manufacturers.set(near.predecessorAccountId(), new Manufacturer(name, account_id));
    near.log(`New manufacturer registered: ${name}`);
  }

  @call({})
  create_product({ name, description, url }: { name: string, description: string, url: string }): void {
    assert(name && description && url, "Name and url must be provided!");
    //Confirm caller is a manufacturer
    const account_id = near.predecessorAccountId();
    assert(this.is_manufacturer({ account_id }), "You're not a manufacturer!");
    // Confirm product does not already exist
    assert(this.products.get(name) == null, "Product exist!s");
    // Create product
    const new_product = new Product(name, description, url, account_id);
    this.products.set(name, new_product);
    // Add product to manufacturer
    const manufacturer = this.manufacturers.get(account_id);
    manufacturer.products.push(name);
    this.manufacturers.set(account_id, manufacturer);
    near.log(`New product created: ${name}`);
  }

  @call({})
  update_product({ name, description, url }: { name: string, description: string, url: string }): void {
    assert(name && description && url, "Name, description and url must be provided!");
    //Confirm caller is a manufacturer
    const account_id = near.predecessorAccountId();
    assert(this.is_manufacturer({ account_id }), "You're not a manufacturer!");
    // Confirm product already exist
    assert(this.products.get(name) != null, "Product does not exist!s");
    // Create product
    const new_product = new Product(name, description, url, account_id);
    this.products.set(name, new_product);
    near.log(`Product updated: ${name}`);
  }

  @call({})
  create_items({ codes, product }: { codes: string[], product: string }): void {
    assert(codes && product, "codes and product must be provided!");
    //Confirm caller is a manufacturer and product exist
    const account_id = near.predecessorAccountId();
    assert(this.is_manufacturer({ account_id }), "You're not a manufacturer!");
    assert(this.products.get(product) != null, "Invalid product!");
    // Hash codes
    const hashes = codes.map((code) => {
      return keccak256(code);
    });
    // Create items
    hashes.forEach((hash) => {
      // Confirm item with the same code does not exist
      assert(this.items.get(hash) == null, "An item with same code already exist!");
      // Create item
      const new_item = new Item(hash, product);
      this.items.set(hash, new_item);
      // Update product's item array
      const _product = this.products.get(product);
      _product.items.push(hash);
      this.products.set(product, _product);
    })
  }

  @call({})
  bought({ code }: { code: string }): void {
    assert(code, "code must be provided!");
    const hash = near.keccak256(code);
    const item = this.items.get(hash);
    assert(item != null, "Invalid code");
    item.bought = true;
    this.items.set(hash, item);
  }

  @view({})
  is_authentic({ code }: { code: string }): { is_valid: boolean, is_bought: boolean } {
    assert(code, "code must be provided!");
    const hash = near.keccak256(code);
    const item = this.items.get(hash);
    let is_valid = item ? true : false;
    let is_bought = true;
    if (item && item.bought == false) {
      is_bought = false;
    }
    return { is_valid, is_bought }
  }

  @view({}) // This method is read-only and can be called for free
  get_product({ name }: { name: string }): Product {
    assert(name, "product name must be provided!");
    assert(this.products.get(name) != null, "Product does not exist!");
    return this.products.get(name);
  }

  @view({}) // This method is read-only and can be called for free
  get_manufacturer({ account_id }: { account_id: string }): Manufacturer {
    assert(account_id, "manufacturer account id must be provided!");
    assert(this.manufacturers.get(account_id) != null, "manufacturer does not exist");
    return this.manufacturers.get(account_id);
  }

  @view({}) // This method is read-only and can be called for free
  is_manufacturer({ account_id }: { account_id: string }): boolean {
    assert(account_id, "manufacturer account id must be provided!");
    if (this.manufacturers.get(account_id) != null) {
      return true;
    }
    return false;
  }

}

function assert(condition, message) { if (!condition) throw Error(message); }