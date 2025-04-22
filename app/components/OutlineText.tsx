import { ColorValue } from "react-native";
import Svg, { NumberProp, Text } from "react-native-svg";

const OutlinedText = ({
  children,
  height,
  width = "100%",
  fontFamily,
  fontSize,
  fill = "white",
  stroke = "black",
  strokeWidth = 1,
}: {
  children: any;
  height: NumberProp;
  width?: NumberProp;
  fontSize?: NumberProp;
  fontFamily?: string;
  fill?: ColorValue;
  stroke?: ColorValue;
  strokeWidth?: NumberProp;
}) => {
  return (
    <Svg height={height} width={width}>
      <Text
        x={"50%"}
        y={"50%"}
        textAnchor={"middle"}
        alignmentBaseline={"middle"}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      >
        {children}
      </Text>
    </Svg>
  );
};

export default OutlinedText;
