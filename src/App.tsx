import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import MovieDetailPage from "./Routes/MovieDetail";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route
          path={[
            "/movie/:movieId/detail",
            "/movie/:movieId/detail/similar/:similarMovieId",
          ]}>
          <MovieDetailPage />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route exact path={["/", "/movies/:category/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
