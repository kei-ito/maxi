export const sanitizeHTMLAttribute = (
    input: string
): string => input
.split('<').join('&lt;')
.split('>').join('&gt;');
