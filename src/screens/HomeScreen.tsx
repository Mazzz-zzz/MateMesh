import React from "react";
import { SearchForService } from "../components/SearchForService";
import { UserBox } from "../components/UserBox";
import "./HomeScreen.css";

const HomeScreen = (): JSX.Element => {
  return (
<div className="home">
      <div className="header">
        <div className="text-wrapper-2">MateMesh</div>
        <SearchForService className="search-for-service-instance" />
      </div>
        <div className="user-box-2">
          <UserBox profile="default" textBox="new-value" />
          <UserBox profile="variant-2" textBox="beauty" />
          <UserBox profile="variant-3" text="✅ CopyWriting" textBox="copywriting" />
          <UserBox profile="variant-4" textBox="beauty" />
          <UserBox profile="variant-5" styling="✅ Styling" textBox="default" />
          <UserBox cooking="✅ Cooking" profile="variant-6" textBox="default" />
          <UserBox dropshipping="✅ dropshipping" profile="variant-7" textBox="default" />
          <UserBox profile="variant-8" textBox="default" />
          <UserBox cooking="✅ Cooking" profile="variant-9" textBox="default" />
          <UserBox className="profile" profile="variant-10" styling="✅ Styling" textBox="default" />
          <UserBox className="profile" profile="variant-11" text="✅ CopyWriting" textBox="default" />
          <UserBox className="profile" profile="variant-12" textBox="default" />
        </div>
      </div>
  );
};

export default HomeScreen;