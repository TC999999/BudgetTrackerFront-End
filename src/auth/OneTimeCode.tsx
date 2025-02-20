import { useState, useCallback } from "react";
import {
  OneTimeCodeFormData,
  OneTimeCodeSelect,
  OneTimeCodeData,
} from "../interfaces/authInterfaces";
import { joinOTPCode } from "../helpers/joinOTPCode";
import FullKeyPad from "../FullKeyPad";

const OneTimeCode = () => {
  const initialState: OneTimeCodeFormData = {
    0: "0",
    1: "0",
    2: "0",
    3: "0",
    4: "0",
    5: "0",
  };

  const initialSelect: OneTimeCodeSelect = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };

  const [formData, setFormData] = useState<OneTimeCodeFormData>(initialState);
  const [formSelect, setFormSelect] =
    useState<OneTimeCodeSelect>(initialSelect);
  const [currPlace, setCurrPlace] = useState<number>(0);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let { value } = e.currentTarget;
      if (currPlace <= 5) {
        setFormData((data) => ({ ...data, [currPlace]: value }));
        setFormSelect((data) => ({ ...data, [currPlace]: true }));
        setCurrPlace(currPlace + 1);
      }
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (currPlace > 0) {
        let backOnePlace = currPlace - 1;
        setFormData((data) => ({ ...data, [backOnePlace]: "0" }));
        setFormSelect((data) => ({ ...data, [currPlace]: false }));
        setCurrPlace(backOnePlace);
      }
    },
    [formData]
  );

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    try {
      let code: string = joinOTPCode(formData);
      let data: OneTimeCodeData = { code };
      console.log(data);
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className="one-time-code-div">
      <div className="one-time-code">
        <h1>
          A 6-digit code was just sent to your linked email. This code will last
          2 minutes. Enter code below.
        </h1>
        <div className="one-time-code-form">
          <div className="one-time-code-digits flex justify-center">
            <div
              className={`digitPlace ${
                currPlace === 0 && "digitPlace-select"
              } ${formSelect[0] && "digitPlace-full"}`}
              id="digitPlace0"
            >
              {formData[0]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 1 && "digitPlace-select"
              } ${formSelect[1] && "digitPlace-full"}`}
              id="digitPlace1"
            >
              {formData[1]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 2 && "digitPlace-select"
              } ${formSelect[2] && "digitPlace-full"}`}
              id="digitPlace2"
            >
              {formData[2]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 3 && "digitPlace-select"
              } ${formSelect[3] && "digitPlace-full"}`}
              id="digitPlace3"
            >
              {formData[3]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 4 && "digitPlace-select"
              } ${formSelect[4] && "digitPlace-full"}`}
              id="digitPlace4"
            >
              {formData[4]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 5 && "digitPlace-select"
              } ${formSelect[5] && "digitPlace-full"}`}
              id="digitPlace5"
            >
              {formData[5]}
            </div>
          </div>
          <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
          <button onClick={handleSubmit} className="submit-code">
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneTimeCode;
