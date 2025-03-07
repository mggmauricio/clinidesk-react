export function validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const calcDigits = (cnpj: string, positions: number[]): number => {
        return positions.reduce((sum, pos, i) => sum + parseInt(cnpj[i]) * pos, 0) % 11;
    };

    const firstDigit = calcDigits(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) < 2 ? 0 : 11 - calcDigits(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (firstDigit !== parseInt(cnpj.charAt(12))) return false;

    const secondDigit = calcDigits(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) < 2 ? 0 : 11 - calcDigits(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return secondDigit === parseInt(cnpj.charAt(13));
}
