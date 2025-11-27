'use client'

import { useTheme } from 'next-themes'

const TopAscii = () => {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <div
            className='align-center flex flex-wrap items-center justify-around text-2xs font-normal leading-tight hover:cursor-pointer hover:text-accent lg:text-sm lg:leading-tight'
            onClick={toggleTheme}
        >
            <pre className='mb-4 mr-4'>
                {'                     '}XXXXXXX{'\n'}
                {'                     '}XXXXXXX{'\n'}
                {'                    '}XXXXXXXX{'\n'}
                {'                    '}XXXXXXXX{'\n'}
                {'                    '}XX{'      '}
                {'\n'}
                {'           '}XXX{'       '}X{'      '}
                {'\n'}
                {'          '}XX X{'       '}X{'      '}
                {'\n'}
                {'         '}XX{'  '}XX{'      '}XX{'     '}
                {'\n'}
                {'         '}X{'    '}XXXXXXX X{'     '}
                {'\n'}
                {'        '}XX{'          '}XXX{'     '}
                {'\n'}
                {'        '}x{'                   '}
                {'\n'}
                {'        '}x{'                   '}
                {'\n'}xxx{'     '}X{'                   '}
                {'\n'}XXX{'    '}XX{'                   '}
                {'\n'}XXX{'  '}XXX{'                    '}
                {'\n'}
                {'  '}XX X{'                      '}
                {'\n'}
                {'   '}XXX{'                      '}
            </pre>
            <pre className='mb-4'>
                {' '}
                XXX XXX{'    '}XXX XXX{'        '}XXX{'      '}XXX XXX
                {'              '}
                {'\n'}XXX{'   '}XXX{'        '}XXX{'     '}XXX XXX{'    '}XXX
                {'   '}XXX{'            '}
                {'\n'}XXX{'   '}XXX{'       '}XXX{'     '}XXX{'   '}XXX{'   '}
                XXX{'   '}XXX{'            '}
                {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'     '}XXX XXX{'    '}XXX
                {'   '}XXX{'            '}
                {'\n'}XXX{'   '}XXX{'     '}XXX{'       '}XXX{'   '}XXX{'   '}
                XXX{'   '}XXX{'            '}
                {'\n'}XXX{'   '}XXX{'    '}XXX{'        '}XXX{'   '}XXX{'   '}
                XXX{'   '}XXX{'            '}
                {'\n'} XXX XXX{'      '}XXX XXX{'   '}XXX{'   '}XXX{'   '}XXX
                {'   '}XXX{'            '}
                {'\n'}
                {'\n'} XXX XXX{'       '}XXX{'      '}XXX{'   '}XXX{'    '}XXX
                XXX{'    '}XXX XXX{'  '}
                {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'    '}XXX{'   '}XXX
                {'      '}XXX{'           '}XXX {'\n'}XXX{'   '}XXX{'   '}XXX
                {'   '}XXX{'    '}XXX XXX{'       '}XXX{'          '}XXX{'  '}
                {'\n'} XXX XXX{'     '}XXX XXX{'       '}XXX{'         '}XXX
                {'       '}XXX XXX {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                {'         '}XXX{'        '}XXX{'    '}
                {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                {'         '}XXX{'       '}XXX{'     '}
                {'\n'} XXX XXX{'    '}XXX{'   '}XXX{'      '}XXX{'       '}XXX
                XXX{'      '}XXX XXX{'\n'}
            </pre>
        </div>
    )
}
export default TopAscii


