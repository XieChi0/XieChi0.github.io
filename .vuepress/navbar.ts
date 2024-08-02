import {NavItem} from "vuepress/config";

export default [
    {
        text: "基本功",
        link: '/docs/基本功/',
        items: [
            {
                text: "计算机组成原理",
                link: '/docs/基本功/计算机组成原理/',
            },
            {
                text: "操作系统",
                link: '/docs/基本功/操作系统/',
            },
            {
                text: "计算机网络",
                link: '/docs/基本功/计算机网络/',
            },
            {
                text: "数据结构",
                link: '/docs/基本功/数据结构/',
            },
            {
                text: "算法",
                link: '/docs/基本功/算法/',
            },
            {
                text: "基础工具",
                link: '/docs/基本功/基础工具/',
                items: [
                    {
                        text: "Git",
                        link: '/docs/基本功/基础工具/Git/',
                    },
                    {
                        text: "Linux",
                        link: '/docs/基本功/基础工具/Linux/',
                    },
                    {
                        text: "Bash",
                        link: '/docs/基本功/基础工具/Bash/',
                    },
                    {
                        text: "Vim",
                        link: '/docs/基本功/基础工具/Vim/',
                    },
                ]
            },

        ]
    },
    {
        text: "前端",
        link: '/docs/前端/',
        items: [
            {
                text: "HTML",
                link: '/docs/前端/HTML/',
            },
            {
                text: "CSS",
                link: '/docs/前端/CSS/',
            },
            {
                text: "JavaScript",
                link: '/docs/前端/JavaScript/',
            },
            {
                text: "数据结构",
                link: '/docs/基本功/数据结构/',
            },
            {
                text: "Vue",
                link: '/docs/前端/Vue/',
            },
            {
                text: "Axios",
                link: '/docs/前端/Axios/',
            },
            {
                text: "工程化",
                link: '/docs/前端/工程化/',
            },
            {
                text: "React",
                link: '/docs/前端/React/',
            },
            {
                text: "React Native",
                link: '/docs/前端/React Native/',
            },
            {
                text: "Tailwind",
                link: '/docs/前端/Tailwind/',
            },
            {
                text: "前端库",
                link: '/docs/前端/前端库/',
            },
            {
                text: "小程序",
                link: '/docs/前端/小程序/',
            },

        ]
    },
    {
        text: "后端",
        link: '/docs/后端/',
        items: [
            {
                text: "Java",
                link: '/docs/后端/Java/',
            },
            {
                text: "数据库",
                link: '/docs/后端/数据库/',
            },
            {
                text: "Spring",
                link: '/docs/后端/Spring/',
            },
        ]
    },
] as NavItem[];
