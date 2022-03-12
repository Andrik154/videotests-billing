import { Link } from 'wouter';

function Index(props){
    return (
        <div className="mt-2">
            <h3>Тесты — больше не проблема!</h3>
            <div dangerouslySetInnerHTML={{__html:props.cmsData.index}} />
        </div>
    )
}

export default Index;