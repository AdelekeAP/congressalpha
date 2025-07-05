import { fetchTrades } from "../utils/api";

useEffect(() => {
  fetchTrades()
    .then(setTrades)
    .catch((err) => console.error(err));
}, []);
