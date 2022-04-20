import React from "react";
import "../App.css";
import {
  TextInput,
  Box,
  Button,
  Image,
  Heading,
  Form,
  FormField,
  Keyboard,
  ResponsiveContext,
} from "grommet";

import blush from "../avatar/Boy-blush.svg";
import confused from "../avatar/Boy-confused.svg";
import happy from "../avatar/Boy-happy.svg";
import sad from "../avatar/Boy-sad.svg";
import mad from "../avatar/Boy-mad.svg";
import smirk from "../avatar/Boy-smirk.svg";
import tongue from "../avatar/Boy-tongue.svg";

const KEYS = {
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  98: "Z",
  8: "delete",
};

const validArray = [
  "you right",
  "ay okay okay",
  "okie smartie pants",
  "i'll give it to you",
  "yipee",
];
const invalidArray = [
  "nah uh honey",
  "sucks to suck",
  "Ha try again buddy",
  "not today boi",
  "bruh you dumb",
];

const validMax = [happy, blush, tongue];
const invalidMax = [sad, mad, confused];

//https: // const CORS = "https://cors-anywhere.herokuapp.com/";
const CORS = "https://serene-scrubland-00249.herokuapp.com/";
const baseURL = "http://www.wordgamedictionary.com/api/v1/references/scrabble/";
// const key = "7.304453775081076e29";
const key = "1.1356492099878718e30";

class Dictionary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordToCheck: [],
      lettersArray: [],
      isValidScrabble: "",
      response: "",
      max: smirk,
      responseColor: "status-ok",
      //max: "../avatar/max1.png"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(event) {
    const letters = /^[A-Za-z]+$/;
    if (event.target.value.match(letters)) {
      this.setState({ wordToCheck: event.target.value });
    } else {
      this.setState({
        wordToCheck: event.target.value === "" ? "" : this.state.wordToCheck,
        response: "",
        max: smirk,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.callAPI(this.state.wordToCheck);
  }

  handleReset(event) {
    event.preventDefault();
    this.setState({
      wordToCheck: "",
      lettersArray: [],
      response: "",
      max: smirk,
    });
  }

  generateURL(wordToCheck) {
    return CORS + baseURL + wordToCheck + "?key=" + key;
  }

  callAPI = async (wordToCheck) => {
    const url = this.generateURL(wordToCheck);
    try {
      const result = await fetch(url);
      const result_str = await result.text();
      const result_XML = new window.DOMParser().parseFromString(
        result_str,
        "text/xml"
      );
      const checkValid = result_XML.getElementsByTagName("scrabble")[0]
        .textContent;

      console.log("resultXML", result_XML, "checkValid", checkValid);
      this.setState({
        isValidScrabble: checkValid === "1" ? true : false,
        responseColor: checkValid === "1" ? "status-ok" : "status-critical",
        response:
          checkValid === "1"
            ? validArray[Math.floor(Math.random() * validArray.length)]
            : invalidArray[Math.floor(Math.random() * invalidArray.length)],
        max:
          checkValid === "1"
            ? validMax[Math.floor(Math.random() * validMax.length)]
            : invalidMax[Math.floor(Math.random() * invalidMax.length)],
      });
    } catch (e) {
      console.log("we are in errrrrrr");
      console.log(e);
    }
  };

  deleteLetter = (event) => {
    const array = [...this.state.lettersArray];
    const index = array.length - 1;
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ lettersArray: array });
    }
  };

  findLetter = (event) => {
    const letter = event.keyCode;
    let isLetter;
    console.log(letter);
    if (letter === 8) {
      this.deleteLetter(event);
    } else {
      if (KEYS[letter]) {
        isLetter = true;
        const fileName = KEYS[letter] + ".png";
        this.setState({
          lettersArray: [...this.state.lettersArray, fileName],
        });
        console.log(this.state.lettersArray);
      } else {
        isLetter = false;
        console.log(event);
      }
      console.log(isLetter);
      return isLetter;
    }
  };

  render() {
    const {
      wordToCheck,
      lettersArray,
      response,
      responseColor,
      max,
    } = this.state;
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Keyboard onKeyDown={this.findLetter}>
            <Box flex direction={size === "small" ? "column" : "row"}>
              <Box
                width={size === "small" ? "100%" : "60%"}
                flex
                height="medium"
              >
                <Box flex direction="row" gap="small">
                  <Heading size="small" className="5 Years Old">
                    scrabble checker:
                  </Heading>
                  <Heading size="small" color={responseColor}>
                    {response}
                  </Heading>
                </Box>
                <Box flex gap="small" direction="row">
                  {lettersArray.map((letter) => (
                    <Box width="xsmall" height="xsmall">
                      <Image
                        fit="contain"
                        src={require(`../assets/${letter}`)}
                      />
                    </Box>
                  ))}
                </Box>
                <Box flex width="large">
                  <Form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                    <FormField>
                      <TextInput
                        placeholder="try me"
                        type="text"
                        value={wordToCheck}
                        onChange={this.handleChange}
                      />
                    </FormField>
                    <Box flex direction="row" justify="start" gap="small">
                      <Button
                        primary
                        disabled={wordToCheck.length > 0 ? false : true}
                        color="status-ok"
                        type="submit"
                        label="Submit"
                        alignSelf="start"
                      />
                      <Button
                        primary
                        color="status-critical"
                        type="reset"
                        label="Reset"
                      />
                    </Box>
                  </Form>
                </Box>
              </Box>
              <Box width={size === "small" ? "100%" : "40%"}>
                <Box width="100%" height="auto" flex direction="column">
                  <Image fit="contain" src={max} />
                </Box>
              </Box>
            </Box>
          </Keyboard>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

export default Dictionary;
