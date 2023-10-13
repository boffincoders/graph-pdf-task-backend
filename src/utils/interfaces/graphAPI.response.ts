export interface IGraphAPIResponse {
    title: string
    keys: string[]
    data: IGraphData[]
}

export interface IGraphData {
    data_year: number
    "Aggravated Assault": number
    "All Other Offenses (Except Traffic)": number
    Arson: number
    Burglary: number
    "Curfew and Loitering Law Violations": number
    "Disorderly Conduct": number
    "Driving Under the Influence": number
    "Drug Abuse Violations - Grand Total": number
    Drunkenness: number
    Embezzlement: number
    "Forgery and Counterfeiting": number
    Fraud: number
    "Gambling - Total": number
    "Human Trafficking - Commercial Sex Acts": number
    "Human Trafficking - Involuntary Servitude": number
    "Larceny - Theft": number
    "Liquor Laws": number
    "Manslaughter by Negligence": number
    "Motor Vehicle Theft": number
    "Murder and Nonnegligent Manslaughter": number
    "Offenses Against the Family and Children": number
    "Prostitution and Commercialized Vice": number
    Rape: number
    Robbery: number
    "Simple Assault": number
    "Stolen Property: Buying, Receiving, Possessing": number
    Suspicion: number
    Vagrancy: number
    Vandalism: number
    "Weapons: Carrying, Possessing, Etc.": number
    "Sex Offenses (Except Rape, and Prostitution and Commercialized Vice)": number
}
