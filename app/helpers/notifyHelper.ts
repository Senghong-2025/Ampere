import { ElNotification } from "element-plus"

interface INotify {
    title: string
    message: string
    type: 'success' | 'error' | 'info'
}

const notify = (
    { title, message, type }: INotify,
    showTitle = false
) => {
    ElNotification({
        title: showTitle ? title : '',
        message,
        type,
        offset: 10,
    })
}

const createNotifier = (type: INotify['type'], defaultTitle: string) => {
    return (message: string, showTitle = false) =>
        notify({ title: defaultTitle, message, type }, showTitle)
}

export default {
    success: createNotifier('success', 'Success'),
    error: createNotifier('error', 'Error'),
    info: createNotifier('info', 'Info'),
}