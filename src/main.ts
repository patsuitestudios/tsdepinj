import {Users} from "./Users";
import {Database} from "./Database";
import {ServiceCollection} from "./ServiceCollection";
import {Drives} from "./Drives";

const serviceCollection = new ServiceCollection()
    .addSingleton(Users, {params: [Database]})
    .addSingleton(Drives, {params: [Database]})
    .addSingleton(Database);
const provider = serviceCollection.build();

// These both get the same Database instance!
console.log(provider.getService(Users).getUser());
console.log(provider.getService(Drives).getDrive());
