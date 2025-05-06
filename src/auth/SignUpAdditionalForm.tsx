import React from "react";
import { SignUpInterface } from "../interfaces/authInterfaces";
import KeyPad from "../KeyPad";
import SignUpIncomeCard from "../incomes/SignUpIncomeCard";

type Props = {
  formData: SignUpInterface;
  keyPadError: boolean;
  showIncomeFormState: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePress: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  removeIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  handleCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const SignUpAdditionalForm: React.FC<Props> = ({
  formData,
  keyPadError,
  handleChange,
  showIncomeFormState,
  handlePress,
  handleDelete,
  removeIncome,
  handleCheckBox,
  handleSubmit,
}) => {
  return (
    <div
      id="additional-register-form"
      className="p-2 bg-green-100 border-2 border-green-700 rounded-lg"
    >
      <header className="text-center">
        <h1 className="text-lg sm:text-3xl text-green-500 font-bold underline">
          Additional Information
        </h1>
        <i className="text-xs">
          (None of the below information is required. You will be allowed to add
          or remove values after registration.)
        </i>
      </header>
      <div id="register-form-div">
        <form onSubmit={handleSubmit}>
          <div id="total-assets-div" className="py-4">
            <label className="text-lg block" htmlFor="moneyAllocated">
              Total Assets: ($ U.S.):{" "}
            </label>
            <input
              className="input"
              id="total_assets"
              type="text"
              name="totalAssets"
              placeholder="0.00"
              value={`$${(formData.totalAssets / 100).toFixed(2)}`}
              onChange={handleChange}
              readOnly
            />
            <small>
              Your total assets must between $999999999999.99 and $0.00
            </small>
            {keyPadError && (
              <div className="text-green-700 font-bold text-sm">
                <p>You've reached the maximum asset value.</p>
              </div>
            )}
          </div>
          <div id="keyPad-div" className="flex justify-center m-5">
            <KeyPad
              handlePress={handlePress}
              handleDelete={handleDelete}
              num={formData.totalAssets}
            />
          </div>
          <section id="incomes-section">
            <header>
              <h1 className="text-lg block">
                Incomes ({formData.incomes.length}/3):
              </h1>
            </header>
            <div id="new-income-list">
              {formData.incomes.length ? (
                formData.incomes.map((i, index) => (
                  <SignUpIncomeCard
                    key={`new-income-${index}`}
                    income={i}
                    removeIncome={removeIncome}
                    index={index}
                  />
                ))
              ) : (
                <i>No Incomes</i>
              )}
            </div>
            <div id="add-income-button">
              <button
                className={`bg-green-600 p-2 m-2 border-2 border-green-600 rounded-full text-white ${
                  formData.incomes.length < 3
                    ? "hover:bg-green-300 hover:text-black active:bg-green-600"
                    : "cursor-not-allowed"
                } `}
                onClick={(e) => showIncomeFormState(e)}
              >
                Add an Income
              </button>
            </div>
            <div id="trusted-div" className="text-center m-2">
              <div className="flex justify-center">
                <div className="flex items-center">
                  <input
                    className="form-checkbox checkbox checkbox-add"
                    id="login_trusted"
                    type="checkbox"
                    name="trusted"
                    checked={formData.trusted}
                    onChange={handleCheckBox}
                  />
                  <label className="text-lg" htmlFor="trusted">
                    Do You Trust This Device?
                  </label>
                </div>
              </div>
              <small>
                (You will have a longer access session on trusted devices.)
              </small>
            </div>
          </section>
          <div id="button-div" className="text-center">
            <button
              id="make-profile-button"
              className="border-2 rounded-full border-green-500 bg-green-500 text-white py-2 px-4 hover:bg-green-200 hover:text-black duration-150 active:bg-green-400"
            >
              Sign Up!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpAdditionalForm;
