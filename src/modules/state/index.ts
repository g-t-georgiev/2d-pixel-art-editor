// import { Store, defineAction } from "schema-store";

// const incrementSchema = {
//   type: "object",
//   properties: {
//     amount: { type: "number" },
//   },
//   required: ["amount"],
//   additionalProperties: false,
// };

// const increment = defineAction(
//   "counter/increment",
//   {
//     schema: incrementSchema,
//     reducer: (state, payload) => {
//       state.counter += payload.amount;
//     },
//     effect: (event) => {
//       console.log("Action dispatched!", event.payload);
//     },
//   }
// );

// const store = new Store({
//   initialState: { counter: 0, test: true },
//   actions: [increment],
// });

// const unsubscribe = store.select(
//   (state) => state.counter,
//   (counter) => console.log("Counter changed to:", counter)
// );

// export default store;