const getCurrentYear = () => {
    const today = new Date();
    const year = today.getFullYear();

    const startHK1 = new Date(year, 8, 5); // 5/9 năm hiện tại (tháng 8 = tháng 9)
    const endHK1 = new Date(year + 1, 0, 30); // 30/1 năm sau (tháng 0 = tháng 1)

    let semester;
    let schoolYear;

    if (today >= startHK1 && today <= endHK1) {
        semester = 1;
        // Nếu là tháng 9 trở đi, thì nằm trong HK1 của năm học hiện tại
        if (today.getMonth() >= 8) {
            schoolYear = `${year}-${year + 1}`;
        } else {
            // Tháng 1 (hoặc tháng 0), thuộc HK1 của năm học trước
            schoolYear = `${year - 1}-${year}`;
        }
    } else {
        semester = 2;
        if (today < startHK1) {
            schoolYear = `${year - 1}-${year}`;
        } else {
            schoolYear = `${year}-${year + 1}`;
        }
    }
    let listYear = [];
    if(today.getMonth() >= 8 && today.getDate() >= 5) {
        listYear = [
            `${year - 2}-${year - 1}`,
            `${year - 1}-${year}`,
            `${year}-${year + 1}`,
        ];
    }else{
        listYear = [
            `${year - 3}-${year-2}`,
            `${year-2}-${year -1}`,
            `${year -1}-${year}`,
        ];
    }
    
    return {
        schoolYear,
        semester,
        listYear
    };
}

export default getCurrentYear;