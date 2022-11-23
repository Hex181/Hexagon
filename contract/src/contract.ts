// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
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
    assert(!this._is_manufacturer(account_id), "Account already registerd!");
    // Register account
    this.manufacturers.set(near.predecessorAccountId(), new Manufacturer(name, account_id));
    near.log(`New manufacturer registered: ${name}`);
  }

  @call({})
  create_product({ name, url }: { name: string, url: string }): void {
    assert(name && url, "Name and url must be provided!");
    //Confirm caller is a manufacturer
    const account_id = near.predecessorAccountId();
    assert(this._is_manufacturer(account_id), "You're not a manufacturer!");
    // Confirm product does not already exist
    assert(this.products.get(name).name == "", "Product exist!s");
    // Create product
    const new_product = new Product(name, url, account_id);
    this.products.set(name, new_product);
    // Add product to manufacturer
    const manufacturer = this.manufacturers.get(account_id);
    manufacturer.products.push(name);
    this.manufacturers.set(account_id, manufacturer);
    near.log(`New product created: ${name}`);
  }

  @call({})
  update_product({ name, url }: { name: string, url: string }): void {
    assert(name && url, "Name and url must be provided!");
    //Confirm caller is a manufacturer
    const account_id = near.predecessorAccountId();
    assert(this._is_manufacturer(account_id), "You're not a manufacturer!");
    // Confirm product already exist
    assert(this.products.get(name).name != "", "Product does nor exist!s");
    // Create product
    const new_product = new Product(name, url, account_id);
    this.products.set(name, new_product);
    near.log(`Product updated: ${name}`);
  }

  @call({})
  create_item({ hash, product }: { hash: string, product: string }): void {
    //Confirm caller is a manufacturer
    const account_id = near.predecessorAccountId();
    assert(this._is_manufacturer(account_id), "You're not a manufacturer!");
    // Confirm item with the same code does not exist
    assert(this.items.get(hash).hash == "", "An item with same code already exist!");
    // Create item
    const new_item = new Item(hash, product);
    this.items.set(hash, new_item);
    // Update product's item array
    const _product = this.products.get(product);
    _product.items.push(hash);
    this.products.set(product, _product);
  }

  @call({})
  is_duplicate({ code }: { code: string }): boolean {
    let is_dup = true;
    const hash = near.keccak256(code);
    assert(this.items.get(hash).hash != "", "Invalid item code");
    if (this.items.get(hash).bought = false) {
      is_dup = false;
    }
    return is_dup;
  }

  @view({}) // This method is read-only and can be called for free
  generate_code({ amount }: { amount: number }): string[] {
    let codes: string[] = []
    for (let i = 0; i < amount; i++) {
      codes.push(generate_random_string());
    }
    return codes;
  }

  @view({}) // This method is read-only and can be called for free
  get_product({ name }: { name: string }): { name: string, url: string, manufacturer: string } {
    const product = this.products.get(name, { defaultValue: new Product("", "", "") });
    assert(this.products.get(name).name != "", "Product does not exist!");
    return { name: product.name, url: product.url, manufacturer: product.manufacturer };
  }

  @view({}) // This method is read-only and can be called for free
  get_manufacturer({ account_id }: { account_id: string }): Manufacturer {
    return this.manufacturers.get(account_id);
  }

  //   // @call({}) // This method changes the state, for which it cost gas
  //   // set_greeting({ message }: { message: String }): void {
  //   //   near.log(`Saving greeting ${message}`);
  //   //   this.message = message;
  //   // }

  _is_manufacturer(account_id: string): boolean {
    let is_manufacturer = false;
    const manufacturer = this.manufacturers.get(account_id, { defaultValue: new Manufacturer("", "") })
    if (manufacturer.id != "") { is_manufacturer = true }
    return is_manufacturer;
  }
}

function assert(condition, message) { if (!condition) throw Error(message); }

// Function that generated a random string of 8 letters
function generate_random_string() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}