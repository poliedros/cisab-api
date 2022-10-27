// async function buildService(useValue) {
//   const module: TestingModule = await Test.createTestingModule({
//     providers: [
//       AbstractRepository,
//       {
//         provide: getModelToken(County.name),
//         useValue: useValue,
//       },
//     ],
//   }).compile();

//   return module.get<CountiesService>(CountiesService);
// }
