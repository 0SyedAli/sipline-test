const STATUSES = {
    "NOT_FOUND": {
        "label": "Bad Gateway",
        "code": 502
    },
    "NOT_MATCHED": {
        "label": "Not Acceptable",
        "code": 406
    },
    "SUCCESS": {
        "label": "OK",
        "code": 200
    },
    "VALIDATION_ERROR": {
        "label": "Validation Error",
        "code": 417
    },
    "INTERNAL_ERROR": {
        "label": "Server/Database Error",
        "code": 500
    },
    "NO_TOKEN": {
        "label": "Unauthorized",
        "code": 401
    },
    "TOKEN_MALFORMED": {
        "label": "Malformed/Expired Token",
        "code": 511
    }
}

function response(title, message, data, status, code, res, type) {
    const obj = {
        title: title,
        message: message,
        data: data,
        status: status,
        code: code
    };

    if (type === 'html') {
        const html = `
            <html>
                <head>
                    <title>Sipline</title>
                </head>
                <body style="font-family: Arial;">
                    <h1 style="text-align: center; margin-top: 50px;">${title}</h1>
                    <p style="text-align: center; width: 50%; margin: auto; margin-bottom: 30px;">${message}</p>
                    <table style="width: 50%; margin: auto">
                        <tbody>
                            <tr>
                                <th style="border: 1px solid lightgray; padding: 10px">Status</th>
                                <td style="border: 1px solid lightgray; padding: 10px">${status}</td>
                                <th style="border: 1px solid lightgray; padding: 10px">Code</th>
                                <td style="border: 1px solid lightgray; padding: 10px">${code}</td>
                            </tr>
                            <tr>
                                <th style="border: 1px solid lightgray; padding: 10px">Data</th>
                                <td colspan="3" style="border: 1px solid lightgray; padding: 10px">${JSON.stringify(data)}</td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        res.status(code).send(html);
    }else {
        res.status(code).send(obj);
    }
    res.end();
}

module.exports = {
    response: (title, message, data, status, code, res, type) => response(title, message, data, status, code, res, type),
    STATUSES: STATUSES
}