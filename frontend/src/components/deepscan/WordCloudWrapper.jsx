import React, { useMemo } from "react";
import ReactWordCloud from "react-wordcloud";

const WordCloudWrapper = (props) => {
  const defaultOptions = useMemo(
    () => ({
      rotations: 2,
      rotationAngles: [0, 90],
      fontSizes: [20, 60],
    }),
    []
  );

  const words = props.words || [];
  const options = { ...defaultOptions, ...props.options };

  return (
    <div className="">
      <ReactWordCloud words={words} options={options} {...props} />
    </div>
  );
};

export default WordCloudWrapper;

/*  <div>
            <WordCloudWrapper
              words={words}
              options={{
                fontSizes: [30, 100], // Minimum and maximum font sizes
                colors: [
                  "#000000",
                  "#3B70A2",
                  "#5BB9D3",
                  "#101A5A",
                  "#171717",
                  "#303030",
                ], // Array of colors
                fontStyle: "normal", // Font style
                rotations: 3, // Number of rotations
                rotationAngles: [0, 90], // Array of rotation angles
                enableTooltip: true, // Enable tooltip on hover
                deterministic: false, // Enable deterministic layout
                fontFamily: "Roboto", // Font family
                padding: 1, // Padding between words
                maxSpeed: "fast", // Speed of the animation
                spiral: "archimedean", // Type of spiral
                fontWeight: "bold", // Font weight
                spiralFromCenter: true,
              }}
            />
          </div> */
