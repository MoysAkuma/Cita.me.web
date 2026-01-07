import React from 'react';

interface Provider {
    id: string;
    name: string;
    ubication: string;
    serviceType: string;
}

interface ResultTableProps {
    providers: Provider[];
}

const ResultTable: React.FC<ResultTableProps> = ({ providers }) => {
    if (providers.length === 0) {
        return (
            <div className="no-results">
                <p>No providers found</p>
            </div>
        );
    }

    return (
        <div className="result-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ubication</th>
                        <th>Service Type</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map((provider) => (
                        <tr key={provider.id}>
                            <td>{provider.name}</td>
                            <td>{provider.ubication}</td>
                            <td>{provider.serviceType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable;
export type { Provider, ResultTableProps };