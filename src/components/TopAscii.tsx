import { useTheme } from 'next-themes';

const TopAscii = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
    <div 
        className="flex flex-wrap align-center justify-around items-center font-normal leading-tight lg:leading-tight text-2xs lg:text-sm hover:cursor-pointer hover:text-accent"
        onClick={toggleTheme}
    >
        <pre className="mb-4 mr-4">{"                     "}XXXXXXX{"\n"}{"                     "}XXXXXXX{"\n"}{"                    "}XXXXXXXX{"\n"}{"                    "}XXXXXXXX{"\n"}{"                    "}XX{"      "}{"\n"}{"           "}XXX{"       "}X{"      "}{"\n"}{"          "}XX X{"       "}X{"      "}{"\n"}{"         "}XX{"  "}XX{"      "}XX{"     "}{"\n"}{"         "}X{"    "}XXXXXXX X{"     "}{"\n"}{"        "}XX{"          "}XXX{"     "}{"\n"}{"        "}x{"                   "}{"\n"}{"        "}x{"                   "}{"\n"}xxx{"     "}X{"                   "}{"\n"}XXX{"    "}XX{"                   "}{"\n"}XXX{"  "}XXX{"                    "}{"\n"}{"  "}XX X{"                      "}{"\n"}{"   "}XXX{"                      "}</pre>
        <pre className="mb-4"> XXX XXX{"    "}XXX XXX{"        "}XXX{"      "}XXX XXX{"              "}{"\n"}XXX{"   "}XXX{"        "}XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"       "}XXX{"     "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"     "}XXX{"       "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX{"        "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"} XXX XXX{"      "}XXX XXX{"   "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}{"\n"} XXX XXX{"       "}XXX{"      "}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX XXX{"  "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"           "}XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"    "}XXX XXX{"       "}XXX{"          "}XXX{"  "}{"\n"} XXX XXX{"     "}XXX XXX{"       "}XXX{"         "}XXX{"       "}XXX XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"        "}XXX{"    "}{"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"       "}XXX{"     "}{"\n"} XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"       "}XXX XXX{"      "}XXX XXX{"\n"}</pre>
      </div>
    )
}
export default TopAscii;