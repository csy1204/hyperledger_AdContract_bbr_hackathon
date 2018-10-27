composer archive create -t dir -n ../

composer network install -a bbrnet@0.0.1.bna -c PeerAdmin@hlfv1

composer network start -c PeerAdmin@hlfv1 -n bbrnet -V 0.0.1  -A admin -S adminpw
# ## 네트워크 업로드 완료



# composer card import -f admin@hlf_hackerton.card

# # 경기도청 participant 넣기
# composer participant add -d '{
#   "$class": "org.petition.prov.participants.headquarter",
#   "Province": "64100000",
#   "Name":"경기도"
#   }' -c admin@hlf_hackerton

# # card 발급. -x를 통해 네트워크 구성원을 집어넣을 권한을 준다.
# composer identity issue -u province -a org.petition.prov.participants.headquarter#64100000 -c admin@hlf_hackerton -x

# composer card import -f province@hlf_hackerton.card

# # import를 마친 뒤 composer identity list를 입력하면 certificate를 볼 수 있다.


# ## 각 부서 담당자는 사실과 다를 수 있음. 부서 고유번호 출처는
# ## https://www.code.go.kr/stdcode/orgCodeL.do 에서 부서 기관코드를 조회한 값임.


# # 성남시

# composer participant add -d'{
#   "$class": "org.petition.prov.participants.PetitionDepartment",
#   "ParticipantKey": "3780251",
#   "District":"성남시",
#   "DepartmentName": "대중교통과",
#   "headquarter": "resource:org.petition.prov.participants.headquarter#64100000"
# }' -c admin@hlf_hackerton 
# ## rule 설정이 되어 있지 않아서, province라고 해도 새 participant를 넣을 권한이 없다.

# composer identity issue -u snBusdepartment -a org.petition.prov.participants.PetitionDepartment#3780251 -c admin@hlf_hackerton -x

# composer participant add -d '{
#   "$class": "org.petition.prov.participants.GovernEmployee",
#   "EmployeeId": "031-729-3717",
#   "Name": "박욱현",
#   "TeamName": "버스행정팀",
#   "PetitionDepartment": "resource:org.petition.prov.participants.PetitionDepartment#3780251"
# }' -c admin@hlf_hackerton

# composer identity issue -u snBusOfficer -a org.petition.prov.participants.GovernEmployee#031-729-3717 -c admin@hlf_hackerton

# ##########################################################################
# # 용인시
# composer participant add -d '{
#   "$class": "org.petition.prov.participants.PetitionDepartment",
#   "ParticipantKey": "4050444",
#   "District": "용인시",
#   "DepartmentName": "민원여권과",
#   "headquarter": "resource:org.petition.prov.participants.headquarter#64100000"
# }' -c admin@hlf_hackerton 

# composer identity issue -u yiBusdepartment -a org.petition.prov.participants.PetitionDepartment#4050444 -c admin@hlf_hackerton -x

# composer participant add -d '{
#   "$class": "org.petition.prov.participants.GovernEmployee",
#   "EmployeeId": "031-324-2156",
#   "Name": "이윤진",
#   "TeamName": "민원여권과",
#   "PetitionDepartment": "resource:org.petition.prov.participants.PetitionDepartment#4050444"
# }' -c admin@hlf_hackerton 

# composer identity issue -u yiBusOfficer -a org.petition.prov.participants.GovernEmployee#031-324-2156 -c admin@hlf_hackerton
# ##############################################################################
# # 수원시
# composer participant add -d '{
#   "$class": "org.petition.prov.participants.PetitionDepartment",
#   "ParticipantKey": "3740306",
#   "District": "수원시",
#   "DepartmentName": "시민봉사과",
#   "headquarter": "resource:org.petition.prov.participants.headquarter#64100000"
# }' -c admin@hlf_hackerton 

# composer identity issue -u swBusdepartment -a org.petition.prov.participants.PetitionDepartment#3740306 -c admin@hlf_hackerton -x

# composer participant add -d '{
#   "$class": "org.petition.prov.participants.GovernEmployee",
#   "EmployeeId": "031-228-2130",
#   "Name": "구솔휘",
#   "TeamName": "yes종합민원팀",
#   "PetitionDepartment": "resource:org.petition.prov.participants.PetitionDepartment#4050444"
# }' -c admin@hlf_hackerton

# composer identity issue -u swBusOfficer -a org.petition.prov.participants.GovernEmployee#031-228-2130 -c admin@hlf_hackerton

# # 버스회사 dummy Data (실제 데이터이긴 함)

# ## 성남시내버스
# composer participant add -d '{
#   "$class": "org.petition.prov.participants.BusCompany",
#   "BusCompanyNumber": "031-747-3200",
#   "BusCompanyName": "성남시내버스",
#   "BusRouteNumber": ["15","15-1","33",
#     "33-1",
#     "50",
#     "50-1",
#     "51",
#     "52",
#     "55",
#     "55-1",
#     "60",
#     "82",
#     "88",
#     "100",
#     "100출",
#     "200",
#     "220",
#     "250",
#     "260",
#     "330",
#     "330출",
#     "331",
#     "340",
#     "340-1",
#     "370",
#     "380",
#     "4000",
#     "9507",
#     "9607"],
#   "ServiceDistrict": ["성남시"]
# }' -c admin@hlf_hackerton

# composer identity issue -u 031-747-3200 -a org.petition.prov.participants.BusCompany#031-747-3200 -c admin@hlf_hackerton


# ## 수원시내버스

# composer participant add -d '{
#   "$class": "org.petition.prov.participants.BusCompany",
#   "BusCompanyNumber": "031-295-7105",
#   "BusCompanyName": "용남고속",
#   "BusRouteNumber": ["2-1",
#  "3",
#  "13-5",
#  "18",
#  "37",
#  "92",
#  "92-1",
#  "98",
#  "201",
#  "4-1",
#  "9",
#  "9-1",
#  "9-2",
#  "15-1",
#  "19",
#  "22",
#  "22-2",
#  "34",
#  "34-1",
#  "46",
#  "51",
#  "88",
#  "88-1",
#  "99",
#  "99-2",
#  "123",
#  "1005",
#  "3002",
#  "3003",
#  "3007",
#  "3008",
#  "5100",
#  "5300",
#  "5300-1",
#  "7000",
#  "7001",
#  "7002",
#  "8800",
#  "M5532",
#  "G5100"],
#   "ServiceDistrict": ["수원시"]
# }' -c admin@hlf_hackerton

# composer identity issue -u 031-295-7105 -a org.petition.prov.participants.BusCompany#031-295-7105 -c admin@hlf_hackerton

# ## 용인시내버스
# composer participant add -d '{
#   "$class": "org.petition.prov.participants.BusCompany",
#   "BusCompanyNumber": "031-321-3721",
#   "BusCompanyName": "경남여객",
#   "BusRouteNumber": ["5000",
#  "5001",
#  "5001-1",
#  "5002",
#  "5003",
#  "5005",
#  "5600",
#  "5700",
#  "2",
#  "2-1",
#  "3",
#  "6",
#  "6-1",
#  "7",
#  "8",
#  "9",
#  "9-1",
#  "9-2",
#  "10",
#  "10-1",
#  "10-2",
#  "10-4",
#  "10-5",
#  "10-6",
#  "10-7",
#  "11",
#  "11-1",
#  "12",
#  "13",
#  "14",
#  "14-1",
#  "14-3",
#  "16",
#  "20",
#  "22",
#  "22-1",
#  "24",
#  "24-1",
#  "24-2",
#  "24-3",
#  "55",
#  "65",
#  "66",
#  "66-4",
#  "68",
#  "70",
#  "71",
#  "71-1",
#  "71-2",
#  "72",
#  "72-1",
#  "73",
#  "73-1",
#  "73-2",
#  "73-3",
#  "73-4",
#  "73-5",
#  "74",
#  "75",
#  "76",
#  "76-1",
#  "76-2",
#  "76-3",
#  "76-4",
#  "76-5",
#  "76-6",
#  "76-7",
#  "76-8",
#  "76-9",
#  "76-10",
#  "76-11",
#  "77",
#  "81",
#  "81-1",
#  "82",
#  "82-1",
#  "83",
#  "83-1",
#  "84",
#  "84-1",
#  "84-2",
#  "85",
#  "88",
#  "88-1",
#  "89",
#  "90",
#  "90-1",
#  "91",
#  "92",
#  "92-1",
#  "93",
#  "93-1",
#  "94",
#  "95",
#  "95-1",
#  "97",
#  "99",
#  "100",
#  "101",
#  "102",
#  "103",
#  "105",
#  "670",
#  "690",
#  "820",
#  "970"],
#   "ServiceDistrict": ["용인시"]
# }' -c admin@hlf_hackerton

# composer identity issue -u 031-321-3721 -a org.petition.prov.participants.BusCompany#031-321-3721 -c admin@hlf_hackerton


# composer-rest-server -c admin@hlf_hackerton -n never