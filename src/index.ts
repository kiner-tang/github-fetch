import { writeJSONSync, existsSync, readFileSync, mkdirpSync } from "fs-extra";
import { FormatedCommit, formatCommitsInfo } from "./utils";
import yargs from "yargs";
import { Octokit } from "octokit";
import { dirname } from "path";

const argvs = yargs(process.argv.slice(2)).argv as Record<string, string>;

const cmd = argvs._[0];

let outputPath = argvs.output;
const owners = argvs.owner?.split(",") || [];
const author = argvs.author;
const full = argvs.full==="true";
let token = argvs.token;

const tokenPath = ".githubtoken";

const hasTokenFile = existsSync(tokenPath);

if (hasTokenFile) {
  token = readFileSync(tokenPath, "utf-8");
}

if (!token) {
  console.error("🙅 请传入 github token");
  process.exit(1);
}

if (owners.length === 0) {
  console.error("🙅 未传入任何 github 用户信息");
  process.exit(1);
}

if (author.length === 0) {
  console.error("🙅 请传入待查询用户的 github 用户名");
  process.exit(1);
}

export const api = new Octokit({
  auth: token,
});

async function getReposByOwner(owner: string): Promise<string[]> {
  try {
    const res = await api.request("GET /users/{owner}/repos", {
      owner,
      per_page: 100000,
    });
    return res.data.map((item: any) => item.name);
  } catch (e) {
    console.error("[getReposByOwner]", e);
  }
  return [];
}

async function getCommits(owner: string, repo: string, author: string) {
  try {
    const res = await api.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      per_page: 100000,
      author,
    });
    if (res.data) {
      const formatedData = formatCommitsInfo(res.data, full);
      return formatedData;
    }
  } catch (e) {
    console.error("[getCommits]", e);
  }

  return [];
}

async function getCommitsInfo() {
  const infos: Record<string, Record<string, FormatedCommit[]>> = {};
  let total = 0;
  let projectTotal = 0;
  for (const owner of owners) {
    infos[owner] = {};
    console.log(`🏃 正在获取用户[${owner}]信息...`);
    const repos = await getReposByOwner(owner);
    for (const repo of repos) {
      console.log(`┣━ 🏃 正在获取项目[${repo}]信息...`);
      const commits = await getCommits(owner, repo, author);
      if (commits.length) {
        infos[owner][repo] = commits;
        projectTotal++;
        total += commits.length;
      }
      console.log(
        `┣━ 🎉 正在获取项目[${repo}]信息获取完毕，当前所有项目提交数为：${total}，当前项目提交数量为：${commits.length}`
      );
    }
  }
  writeJSONSync(outputPath, infos);
  console.log(
    `┗━ 🎉 所有信息获取完毕，总共为${projectTotal}个项目提交了${total}个PR，数据已保存至[${outputPath}]！`
  );
}

outputPath = outputPath || `./${cmd}-${author}.json`;

if (!existsSync(outputPath)) {
  mkdirpSync(dirname(outputPath));
}
outputPath = outputPath.replace(/\{\{author\}\}/, author).replace(/\{\{owner\}\}/, argvs.owner).replace(/\{\{cmd\}\}/, cmd);

switch (cmd) {
  case "commit":
    getCommitsInfo();
    break;
  default:
}
