export type FormatedCommit = {
    // 作者 id
    id: string;
    // 作者用户名
    name: string;
    // 作者头像 url
    avatar: string;
    // 本次提交的主题
    message: string;
    // 本次提交详情信息
    desc: string;
    // 提交时间
    time: string;
    // 本次提交记录的网页地址
    html_url: string;
    // github 返回的全量信息
    extra?: any;
};
export function formatCommitsInfo(commits: any[], full = false): FormatedCommit[] {
    return commits.map(item => ({
        id: item.author.id,
        name: item.author.login,
        avatar: item.author.avatar_url,
        message: item.commit.message.split('\n')[0],
        desc: item.commit.message,
        time: item.commit.author.date,
        html_url: item.html_url,
        extra: full ? commits : {}
    }))
}