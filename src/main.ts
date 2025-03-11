import {Users} from "./Users";
import {Database} from "./Database";
import {ServiceCollection} from "./ServiceCollection";
import {Drives} from "./Drives";

const serviceCollection = new ServiceCollection()
    .addSingleton(Users, {params: [Database, 4]})
    .addSingleton(Drives, {params: [Database]})
    .addSingleton(Database);
const provider = serviceCollection.build();

// These both get the same Database instance!
console.log(provider.getService(Users).getUsers());
console.log(provider.getService(Drives).getDrive());
