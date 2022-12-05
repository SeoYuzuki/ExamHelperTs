import Topic from "@/types/Topic";

/**
 * 讀檔 回傳Topic物件
 * @param {*} file 檔案
 */
const getTopicByFile = async function (file: File): Promise<Topic> {
    return new Promise((resolve) => {
        if (!file.name.includes(".txt") && !file.name.includes(".json")) {
            //this.$Message.warning("不合規副檔名");
            resolve({ topicName: "", topicInfo: "", questionElementList: [] });
            return;
        }

        const reader: FileReader = new FileReader();
        reader.onloadend = () => {
            const topic: Topic = JSON.parse(reader.result as string);
            if (topic.topicName) {
                console.log("working on " + topic.topicName);
            } else {
                console.log("不合規檔案");
                //this.$Message.warning("不合規檔案");
            }

            resolve(topic);
        };
        reader.onerror = err => {
            //this.$Message.warning("讀檔錯誤");
            console.log("readFile error");
        };
        reader.readAsText(file);
    });
};


const getTopicsByFile = async function (files: FileList | null): Promise<Topic[]> {
    if (files) {
        const topicList: Topic[] = [];
        for (let i = 0; i < files.length; i++) {
            topicList.push(await getTopicByFile(files[i]));
        }
        return topicList;
    } else {
        return []
    }
}

export { getTopicsByFile }