import Airing from "../Components/tv/Airing";
import OnTheAir from "../Components/tv/OntheAir";
import Popular from "../Components/tv/Popular";
import TopRated from "../Components/tv/TopRated";

function Tv() {
  return (
    <>
      <Airing />
      <Popular />
      <TopRated />
      <OnTheAir />
    </>
  );
}

export default Tv;
