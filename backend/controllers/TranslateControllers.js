import translate from 'translate'


translate.engine = "google"; // "google", "yandex", "libre", "deepl"
translate.key = null;

export const translateMessageText = async (req,res) => {
    try {
        const { text, targetLanguage } = req.body;
        
        const translatedMessageText = await translate(text, targetLanguage);
        if (!translatedMessageText) {
            return res.status(500).json({
                success: false,
                message: "Translation service failed to return a result"
            })
        }
        res.status(200).json({
            success: true,
            translatedMessageText
        })
    } catch (error) {
        console.error('Translation error: ', error);
        res.status(500).json({
            success: false,
            message: "Failed to translate message",
        });
    }
}