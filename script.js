'use-strict';

// get element id

const getId = (id) => document.getElementById(id);

// spinner implementation
const toggleSpinner = (isLoading) => {
  const loadSpinner = getId('load-spinner');
  if (!isLoading) {
    loadSpinner.classList.add('hidden');
  }
};

// all cards appending with a common function
const cardAppending = (allCards, singleAI) => {
  const { name, image, features, published_in, id } = singleAI;

  // cards inner content
  allCards.innerHTML += `
    <div class="card border border-1 shadow-xl">
      <!-- card-image-started -->
        <figure class="px-10 pt-10">
          <img src="${image}" alt="" class="rounded-xl max-w-full" />
        </figure>
      <!-- card-image-ended -->
      <!-- card-body-started -->
        <div class="card-body">
        <!-- card-title -->
          <h2 class="card-title text-[#111111] font-semibold text-lg md:text-3xl mb-4">Features</h2>
          <div class="list-decimal" id="${singleAI.id}"></div>
          <hr class="mt-2" />
          <!-- card-actions-started -->
            <div class="card-actions mt-2 justify-between items-center">
            <!-- card-heading-started -->
              <div class="card-heading">
                <h2 class="text-[#111111] font-semibold text-lg md:text-3xl mb-4">${name}</h2>
            <!-- card-date-started -->
              <div class="flex gap-2 card-date">
                <p class="grow-0"><i class="fa-solid fa-calendar-days"></i></p>
                <p class="grow-0">${published_in}</p>
              </div>
            <!-- card-date-ended -->
              </div>
            <!-- card-heading-ended -->
            <!-- details-button -->
              <div><label for="my-modal-5" class="btn mx-4 rounded-full bg-[#FEF7F7] h-12 w-12 text-[#EB5757] border-0" onclick="fetchId('${id}')"><i class="fa-solid fa-arrow-right"></i></label></div>
            </div>
            </div>
            <!-- card-actions-ended -->
        </div>
        <!-- card-body-ended -->
`;

  toggleSpinner(false);
};

// accuracy checking

function calcAccuracy(accuracyData) {
  return accuracyData * 100 + '% accuracy';
}

// sorting

function sorting(a, b) {
  const dateA = new Date(a.published_in);
  const dateB = new Date(b.published_in);
  if (dateA > dateB) {
    return 1;
  } else if (dateA < dateB) {
    return -1;
  } else {
    return 0;
  }
}

// data fetching

const fetchData = async (dataLimit) => {
  const url = `https://openapi.programming-hero.com/api/ai/tools`;
  const response = await fetch(url);
  const data = await response.json();
  showData(data.data.tools, dataLimit);
};

//show limited data
const showData = (allAI, dataLimit) => {
  const allCards = getId('all-cards');
  const seeMore = getId('see-more');
  toggleSpinner(true);
  if (dataLimit && allAI.length > 6) {
    allAI = allAI.slice(0, 6);
    seeMore.classList.remove('hidden');
  }
  allAI.forEach((singleAI) => {
    cardAppending(allCards, singleAI);
  });
  allAI.forEach((singleAI) => {
    for (const i of singleAI.features) {
      document.getElementById(singleAI.id).innerHTML += `<li>${i}</li>`;
    }
  });

  getId('sort-date').addEventListener('click', function () {
    allCards.innerHTML = '';
    showData(allAI.sort(sorting));
  });
};
fetchData(6);

// fetch data to reload on button clicked

const fetchAllData = async () => {
  const url = `https://openapi.programming-hero.com/api/ai/tools`;
  const response = await fetch(url);
  const data = await response.json();
  showAllData(data.data.tools);
};

// show data from button clicked

const showAllData = (allAI) => {
  const allCards = getId('all-cards');
  const seeMore = getId('see-more');
  toggleSpinner(true);
  allCards.innerHTML = '';
  seeMore.classList.add('hidden');
  allAI.forEach((singleAI) => {
    cardAppending(allCards, singleAI);
  });
  allAI.forEach((singleAI) => {
    for (const i of singleAI.features) {
      document.getElementById(singleAI.id).innerHTML += `<li>${i}</li>`;
    }
  });

  //sort button

  getId('sort-date').addEventListener('click', function () {
    allCards.innerHTML = '';
    showAllData(allAI.sort(sorting));
  });
};

// fetch unique id for all

const fetchId = (id) => {
  fetchDetails(id);
};

// fetch details to show on modal

const fetchDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  showDetails(data.data);
};

// show details on modal

const showDetails = (detailsData) => {
  const modalDetails = getId('modal-details');
  const { description } = detailsData;

  // details as modal's inner HTML content

  modalDetails.innerHTML = `
  <div class="details-text-content bg-[#FEF6F6] rounded-md border border-[#EB5757] p-2 md:p-4">
        <div class="card w-full h-full text-[#FFFFFF]">
          <div class="card-body">
            <h2 class="card-title text-[#111111] font-semibold text-xl">${description}</h2>
            <!-- pricing-box-started -->
              <div id="price-box" class="pricing flex gap-1">
                <div class="bg-[#fff] rounded-lg p-2">
                  <div class = "text-[#03A30A] md:text-xl">
                    <p>${
                      detailsData.pricing === null
                        ? `Free of cost`
                        : detailsData.pricing[0].price
                    }</p>
                    <p>${
                      detailsData.pricing === null
                        ? `Free of cost`
                        : detailsData.pricing[0].plan
                    }</p>
                  </div>
                </div>
              <div class="bg-[#fff] rounded-lg p-2">
                <div class = "text-[#F28927] md:text-xl">
                  <p>${
                    detailsData.pricing === null
                      ? `Free of cost`
                      : detailsData.pricing[1].price
                  }</p>
                    <p>${
                      detailsData.pricing === null
                        ? `Free of cost`
                        : detailsData.pricing[1].plan
                    }</p>
                </div>
                </div>
                
                <div class="bg-[#fff] rounded-lg p-2">
                  <div class = "text-[#EB5757] md:text-xl">
                    <p>${
                      detailsData.pricing === null
                        ? `Free of cost`
                        : detailsData.pricing[2].price
                    }</p>
                      <p>${
                        detailsData.pricing === null
                          ? `Free of cost`
                          : detailsData.pricing[2].plan
                      }</p>
                  </div>
                </div>
              </div>
            <!-- pricing-box-ended -->
            <!-- features-int-started -->
            <div class="flex features-int gap-3">
              <div class="features">
              <h2 class="text-[#111111] font-semibold text-lg md:text-3xl mb-4">Features</h2>
              <div id="d-features">
              
              </div>
              </div>
              <div id='inti' class="inti">
              <h2 class="text-[#111111] font-semibold text-lg md:text-3xl mb-4">Integrations</h2>

              </div>
            </div>
            <!-- features-int-ended -->
          </div>
        </div>
      </div>
      <!-- details-text-content-ended -->
      <!-- details-content-start -->
      <div class="h-full border border-[#E7E7E7] p-4 rounded-lg relative"><img src="${
        detailsData.image_link[0]
      }" alt="" class="rounded-xl max-w-full" />
      <div id="accurate" class="hidden">
 
      </div>
      <h3 class="py-4 text-center text-[#111111] font-semibold text-2xl">${
        detailsData.input_output_examples === null
          ? `No Data`
          : detailsData.input_output_examples[0].input
      }</h3>
      <p class="py-4 text-center text-[#585858] text-base">${
        detailsData.input_output_examples === null
          ? `No Data`
          : detailsData.input_output_examples[0].output
      }</p>
      </div>
      <div class="modal-action justify-center md:absolute md:top-0 md:right-2">
        <label for="my-modal-5" class="btn bg-[#EB5757] md:rounded-full text-[#ffffff] md:border-0 md:h-14 md:w-14"><i class="fa-solid fa-xmark"></i></label>
      </div>
  
  `;

  //inserting accuracy data

  const accurate = getId('accurate');
  if (detailsData.accuracy.score) {
    accurate.classList.remove('hidden');
    accurate.innerHTML = `
    <div class="bg-[#EB5757] p-3 rounded-lg text-[#ffffff] font-bold absolute top-1 right-15 md:top-2 md:right-10">${calcAccuracy(
      detailsData.accuracy.score
    )}</div>
    `;
  }

  // displaying features on modal

  const detailFeature = getId('d-features');
  // loop through features
  for (let feature in detailsData.features) {
    let singleFeature = detailsData.features[feature].feature_name;
    detailFeature.innerHTML += `<li class="text-[#585858]">${singleFeature}</li>`;
  }
  //loop through integration
  const intigrate = getId('inti');
  //handling null data
  if (detailsData.integrations === null) {
    intigrate.innerHTML += `<li class="text-[#585858]">No Data</li>`;
  } else {
    for (let inti in detailsData.integrations) {
      let i = detailsData.integrations[inti];
      intigrate.innerHTML += `<li class="text-[#585858]">${i}</li>`;
    }
  }
};
