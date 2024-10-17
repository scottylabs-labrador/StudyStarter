


export default function FeedPage() {
  const opens = [{title:"18100 HW 5",course:"18100", time:"12/1 10:00", location:"Hunt"}, {title:"21127 test 2 prep",course:"21127", time:"12/24 10:00", location:"Stever"}];
  const scheduled = [{title:"18100 study group",course:"18100", time:"TBD", location:"Hunt"}, {title:"21127 HELP ME PLEASE",course:"21127", time:"Wednesday 10:00", location:"Wean"}];

  const displayOpens = opens.map((studyGroupCard) => 
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{studyGroupCard.title}</div>
          <ul>
            <li>{studyGroupCard.course}</li>
            <li>{studyGroupCard.time}</li>
            <li>{studyGroupCard.location}</li>
          </ul>
      </div>
    </div>
  );

  const displayScheduled = scheduled.map((studyGroupCard) => 
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{studyGroupCard.title}</div>
          <ul>
            <li>{studyGroupCard.course}</li>
            <li>{studyGroupCard.time}</li>
            <li>{studyGroupCard.location}</li>
          </ul>
      </div>
    </div>
  );

  

  return (
    
    <main className="container relative overflow-scroll h-screen">
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
    
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <ul className="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                  <li className="mr-2" role="presentation">
                      <button className="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300" id="open-tab" data-tabs-target="#open" type="button" role="tab" aria-controls="open" aria-selected="false">Open</button>
                  </li>
                  <li className="mr-2" role="presentation">
                      <button className="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active" id="scheduled-tab" data-tabs-target="#scheduled" type="button" role="tab" aria-controls="scheduled" aria-selected="true">Scheduled</button>
                  </li>
              </ul>
          </div>
          <div id="myTabContent">
              <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="open" role="tabpanel" aria-labelledby="open-tab">
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-4">
                    {displayOpens}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800" id="scheduled" role="tabpanel" aria-labelledby="scheduled-tab">
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-4">
                    {displayScheduled}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>                                                                                                                                                                                                                            
      <script src="https://unpkg.com/@themesberg/flowbite@1.2.0/dist/flowbite.bundle.js"></script>
    </main>
  );
}
