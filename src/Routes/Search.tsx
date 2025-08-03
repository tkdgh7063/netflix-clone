import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import {
  getMultiSearch,
  MovieSearchResult,
  MultiResult,
  PersonSearchResult,
  TVSearchResult,
} from "../api";
import { toTitleCase } from "../utils";

const Wrapper = styled.div`
  padding: 65px 205px;
`;

const Loader = styled.div``;

const SearchResultsContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const SearchResultsTitle = styled.h2`
  margin-bottom: 20px;
`;

const SearchCategoryTitle = styled.h3``;

const MovieSearchContainer = styled.div`
  min-height: 50px;
  background-color: red;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TVSearchContainer = styled.div`
  min-height: 50px;
  background-color: orange;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const PersonSearchContainer = styled.div`
  min-height: 50px;
  background-color: blue;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Result = styled.div`
  height: 20px;
  margin-bottom: 10px;
`;

function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("keyword") as string;

  const { isLoading, data } = useQuery<MultiResult>(
    ["multi", query],
    () => getMultiSearch(query),
    {
      enabled: !!query,
    }
  );

  if (!isLoading && !data) {
    return <div>No Results</div>;
  }

  const MoviesResult = data?.results.filter(
    (item): item is MovieSearchResult => item.media_type === "movie"
  );
  const TVsResult = data?.results.filter(
    (item): item is TVSearchResult => item.media_type === "tv"
  );
  const PeopleResult = data?.results.filter(
    (item): item is PersonSearchResult => item.media_type === "person"
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Searching...</Loader>
      ) : (
        <SearchResultsContainer>
          <SearchResultsTitle>
            {`Search results for '${toTitleCase(query)}'`}
          </SearchResultsTitle>
          <SearchCategoryTitle>
            Movies({MoviesResult?.length})
          </SearchCategoryTitle>
          <MovieSearchContainer>
            {MoviesResult &&
              MoviesResult.length > 0 &&
              MoviesResult?.map((item) => (
                <Result key={item.id}>{item.title}</Result>
              ))}
          </MovieSearchContainer>
          <SearchCategoryTitle>
            TV Shows({TVsResult?.length})
          </SearchCategoryTitle>
          <TVSearchContainer>
            {TVsResult &&
              TVsResult?.length > 0 &&
              TVsResult?.map((item) => (
                <Result key={item.id}>{item.name}</Result>
              ))}
          </TVSearchContainer>
          <SearchCategoryTitle>
            Person({PeopleResult?.length})
          </SearchCategoryTitle>
          <PersonSearchContainer>
            {PeopleResult &&
              PeopleResult?.length > 0 &&
              PeopleResult?.map((item) => (
                <Result key={item.id}>{item.name}</Result>
              ))}
          </PersonSearchContainer>
        </SearchResultsContainer>
      )}
    </Wrapper>
  );
}

export default Search;
