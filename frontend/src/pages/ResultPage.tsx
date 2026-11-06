import type { PromptResponse } from '../types/prompt';
import PromptResult from '../components/prompt/PromptResult';
export default function ResultPage({result}:{result:PromptResponse}){return <PromptResult result={result}/>;}
