"use strict";

import gulp from "gulp";
import config from "../config.js";
import FtpDeploy from "ftp-deploy";

const ftpDeploy = new FtpDeploy();

// 接続情報を設定
const ftpOptions = {
  user: "",
  password: "",
  host: "",
  localRoot: config.dist, //アップロードするファイルがあるフォルダを指定
  remoteRoot: "/html/", //サーバーのアップロード先を指定
  include: ["*"], //アップロードするファイルを指定できます。
  exclude: [], //アップロードしないファイルを指定できます。
  deleteRemote: false,
};

const deploy = (done) => {
  ftpDeploy.deploy(ftpOptions, (error) => {
    if (error) {
      console.log("Error", error);
    }
  });
  done();
};

exports.deploy = deploy;
