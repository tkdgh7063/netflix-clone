import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { TV } from "../../api";
import useWindowDimensions from "../../useWindowDimensions";
import { makeImagePath, makeLayoutId, OFFSET } from "../../utils";

const SliderContainer = styled.div`
  padding: 0px 60px;
  position: relative;
`;

const TvRow = styled.div`
  position: relative;
  top: -110px;
`;

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  bottom: -10px;
  z-index: 10;
`;

const Left = styled(Button)`
  left: 10px;
`;

const Right = styled(Button)`
  right: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const TvBox = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: white;
  font-size: 18px;
  font-weight: 400;
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  &:first-child {
    transform-origin: center left !important;
  }
  &:last-child {
    transform-origin: center right !important;
  }
`;

const TvOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: 5px;
`;

const TvInfo = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const SliderVariants: Variants = {
  enter: ({ direction, width }: { direction: number; width: number }) => ({
    x: direction < 0 ? width + 5 : -width - 5,
  }),
  center: {
    x: 0,
  },
  exit: ({ direction, width }: { direction: number; width: number }) => ({
    x: direction > 0 ? width + 5 : -width - 5,
  }),
};

const TvVariants: Variants = {
  normal: {
    scale: 1,
    y: 0,
    transition: { type: "tween" },
  },
  hover: {
    scale: 1.2,
    y: -50,
    transition: { type: "tween", delay: 0.5, duration: 0.3 },
  },
};

const overlayVariants: Variants = {
  normal: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { type: "tween", delay: 0.5, duration: 0.5 },
  },
};

const TvInfoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: { type: "tween", delay: 0.5, duration: 0.2 },
  },
};

interface SliderProps {
  category: string;
  tv: TV[];
}
const Slider = ({ category, tv }: SliderProps) => {
  const history = useHistory();
  const width = useWindowDimensions();

  const similar = useRouteMatch<{ tvId: string }>("/tv/:tvId/detail");

  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState(0);

  const decrementIndex = () => {
    if (tv) {
      if (isExiting) return;
      setDirection(1);
      setIsExiting(true);
      const maxIndex = Math.floor(tv.length / OFFSET);
      setIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    }
  };

  const incrementIndex = () => {
    if (tv) {
      if (isExiting) return;
      setDirection(-1);
      setIsExiting(true);
      const maxIndex = Math.floor(tv.length / OFFSET);
      setIndex((prev) => (prev + 1) % maxIndex);
    }
  };

  const onTvClick = (tvId: number) => {
    if (similar) {
      history.push(`/tv/${similar.params.tvId}/detail/similar/${tvId}`);
    } else history.push(`/tv/${category}/${tvId}`);
  };

  return (
    <SliderContainer>
      <Left onClick={decrementIndex}>&larr;</Left>
      <TvRow>
        <AnimatePresence
          initial={false}
          custom={{ direction, width }}
          onExitComplete={() => setIsExiting(false)}>
          <Row
            key={index}
            variants={SliderVariants}
            custom={{ direction, width }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.8 }}>
            {tv.slice(OFFSET * index, OFFSET * (index + 1)).map((tv) => (
              <TvBox
                key={tv.id}
                layoutId={makeLayoutId(category, tv.id.toString())}
                style={{ overflow: "hidden" }}
                variants={TvVariants}
                initial="normal"
                animate="normal"
                whileHover="hover"
                onClick={() => onTvClick(tv.id)}
                $bgPhoto={
                  tv.backdrop_path
                    ? makeImagePath(tv.backdrop_path)
                    : tv.poster_path
                    ? makeImagePath(tv.poster_path)
                    : ""
                }>
                <TvOverlay variants={overlayVariants} />
                <TvInfo variants={TvInfoVariants}>
                  <h4>{tv.name}</h4>
                </TvInfo>
              </TvBox>
            ))}
          </Row>
        </AnimatePresence>
      </TvRow>
      <Right onClick={incrementIndex}>&rarr;</Right>
    </SliderContainer>
  );
};

export default Slider;
