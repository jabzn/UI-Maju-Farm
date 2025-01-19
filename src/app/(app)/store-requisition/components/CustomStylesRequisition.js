const CustomStylesTransaction = {
    tableWrapper: {
        style: {
            height: '250px', // Increase overall table height
            overflow: 'hidden', // Hide overflow from wrapper
        },
    },
    headCells: {
        style: {
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#f4f4f4',
            color: '#4a4a4a',
        },
    },
    headRow: {
        style: {
            minHeight: '40px', // Increased header height
            backgroundColor: '#1f1f1f',
        },
    },
    rows: {
        style: {
            height: '30px', // Set specific row height
            minHeight: '30px', // Ensure minimum height
        },
    },
    table: {
        style: {
            overflowY: 'auto', // Enable vertical scrolling for the table content
            height: 'calc(100% - 10px)', // Subtract header height from total height
        },
    },
};

export default CustomStylesTransaction;